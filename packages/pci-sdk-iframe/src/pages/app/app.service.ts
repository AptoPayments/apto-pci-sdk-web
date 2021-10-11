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
}

async function showCardData({ dispatch, cardId }: IShowCardDataArgs) {
	dispatch({
		uiStatus: 'CARD_DATA_HIDDEN',
		isLoading: true,
		message: '',
		nextStep: 'VIEW_CARD_DATA',
	});

	try {
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
			return dispatch({ message: 'Invalid API key', isLoading: false });
		}

		if (checkRequires2FACodeError(err)) {
			// Verification id failed. Lets get a new one and try again.
			try {
				const { verificationId } = await apiClient.request2FACode();
				return dispatch({ verificationId, isVerificationIdValid: false, uiStatus: 'OTP_FORM' });
			} catch (e) {
				return dispatch({
					isLoading: false,
					isVerificationIdValid: false,
					message: 'Unexpected error',
					uiStatus: 'CARD_DATA_HIDDEN',
					verificationId: '',
				});
			}
		}

		return dispatch({
			isVerificationIdValid: false,
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

export default {
	hideCardData,
	isDataVisible,
	setStyle,
	setTheme,
	showCardData,
	showSetPinForm,
};
