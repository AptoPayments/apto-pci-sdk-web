import apiClient from 'apiClient';
import themeService from 'services/theme.service';
import IApplicationState from 'types/IApplicationState';
import { ITheme } from 'types/IThemes';
import messageService from './message.service';
import themes, { IThemeName } from './themes';

interface ISetStyleArgs {
	dispatch: React.Dispatch<Partial<IApplicationState>>;
	style: ITheme;
}

function setStyle({ dispatch, style }: ISetStyleArgs) {
	return dispatch({ theme: themeService.extendTheme(style) });
}

interface ISetThemeArgs {
	dispatch: React.Dispatch<Partial<IApplicationState>>;
	theme: IThemeName;
}

function setTheme({ dispatch, theme }: ISetThemeArgs) {
	return dispatch({ theme: themes[theme] });
}

interface IHideCardDataArgs {
	dispatch: React.Dispatch<Partial<IApplicationState>>;
	lastFour: string;
}

function hideCardData({ dispatch, lastFour }: IHideCardDataArgs) {
	return dispatch({ cvv: '•••', exp: '••/••', pan: `•••• •••• •••• ${lastFour}` });
}

interface IIsDataVisibleArgs {
	dispatch: React.Dispatch<Partial<IApplicationState>>;
	isVisible: boolean;
}

function isDataVisible({ dispatch, isVisible }: IIsDataVisibleArgs) {
	return messageService.emitMessage({ type: 'apto-iframe-visibility-change', payload: { isVisible } });
}

interface IShowCardDataArgs {
	dispatch: React.Dispatch<Partial<IApplicationState>>;
	cardId: string;
	isPCICompliant: boolean;
}

async function showCardData({ dispatch, cardId, isPCICompliant }: IShowCardDataArgs) {
	dispatch({
		uiStatus: 'CARD_DATA_HIDDEN',
		isLoading: true,
		message: '',
		nextStep: 'VIEW_CARD_DATA',
	});

	try {
		if (!isPCICompliant) {
			return handleNoPCICompliant(dispatch);
		}

		const cardData = await apiClient.getCardData(cardId);

		if (cardData) {
			dispatch({
				cvv: cardData.cvv,
				exp: cardData.exp,
				isLoading: false,
				message: '',
				pan: cardData.pan,
				uiStatus: 'CARD_DATA_VISIBLE',
			});
		}
	} catch (err) {
		if (checkIfInvalidAPIKeyError(err)) {
			return dispatch({ message: 'Invalid API key', uiStatus: 'CARD_DATA_HIDDEN', isLoading: false });
		}

		if (checkRequires2FACodeError(err)) {
			handleNoPCICompliant(dispatch);
		}

		return dispatch({
			isLoading: false,
			message: 'Unexpected error',
			uiStatus: 'CARD_DATA_HIDDEN',
			verificationId: '',
		});
	}
}

interface IShowSetPinFormArgs {
	dispatch: React.Dispatch<Partial<IApplicationState>>;
}

async function showSetPinForm({ dispatch }: IShowSetPinFormArgs) {
	const { verificationId } = await apiClient.request2FACode();
	return dispatch({ verificationId, uiStatus: 'OTP_FORM', nextStep: 'SET_PIN', message: '' });
}

function checkIfInvalidAPIKeyError(err: unknown) {
	return String(err).includes('The mobile API key you provided is invalid');
}

function checkRequires2FACodeError(err: unknown) {
	return String(err).includes('Cardholder needs to verify their identity');
}

async function handleNoPCICompliant(dispatch: React.Dispatch<Partial<IApplicationState>>) {
	// Verification id failed. Lets get a new one and try again.
	const { verificationId } = await apiClient.request2FACode();
	return dispatch({ verificationId, uiStatus: 'OTP_FORM' });
}

export default {
	hideCardData,
	isDataVisible,
	setStyle,
	setTheme,
	showCardData,
	showSetPinForm,
};
