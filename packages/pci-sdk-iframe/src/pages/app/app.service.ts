import apiClient from 'apiClient';
import themeService from 'services/theme.service';
import IStateFn from 'types/IStateFn';
import { ITheme } from 'types/IThemes';
import messageService from './message.service';
import themes, { IThemeName } from './themes';

interface ISetStyleArgs {
	dispatch: IStateFn;
	style: ITheme;
}

function setStyle({ dispatch, style }: ISetStyleArgs) {
	return dispatch({ theme: themeService.extendTheme(style) });
}

interface ISetThemeArgs {
	dispatch: IStateFn;
	theme: IThemeName;
}

function setTheme({ dispatch, theme }: ISetThemeArgs) {
	return dispatch({ theme: themes[theme] });
}

interface IHideCardDataArgs {
	dispatch: IStateFn;
	lastFour: string;
}

function hideCardData({ dispatch, lastFour }: IHideCardDataArgs) {
	return dispatch({ cvv: '•••', exp: '••/••', pan: `•••• •••• •••• ${lastFour}` });
}

interface IIsDataVisibleArgs {
	dispatch: IStateFn;
	isVisible: boolean;
}

function isDataVisible({ dispatch, isVisible }: IIsDataVisibleArgs) {
	return messageService.emitMessage({ type: 'apto-iframe-visibility-change', payload: { isVisible } });
}

interface IShowCardDataArgs {
	dispatch: IStateFn;
	cardId: string;
	isPCICompliant: boolean | undefined;
}

/**
 * Function to display PCI-CARD-DATA.
 *
 * If we know in advance that the client is not PCI compliant we need to get and validate a verification ID from the server saving a request
 * Otherwise we try to get the card data from the server.
 *   - If the client is not PCI compliant we need to get and validate a verification ID from the server
 *   - Else the server will return with valid card data and we can show the card data
 */
function showCardData({ dispatch, cardId, isPCICompliant }: IShowCardDataArgs) {
	dispatch({
		uiStatus: 'CARD_DATA_HIDDEN',
		isLoading: true,
		message: '',
		nextStep: 'VIEW_CARD_DATA',
	});

	if (!isPCICompliant) {
		return handleNoPCICompliant(dispatch);
	}

	return apiClient
		.getCardData(cardId)
		.then((card) => dispatch({ ...card, isLoading: false, message: '', uiStatus: 'CARD_DATA_VISIBLE' }))
		.catch((err) => {
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
		});
}

interface IShowSetPinFormArgs {
	dispatch: IStateFn;
}

async function showSetPinForm({ dispatch }: IShowSetPinFormArgs) {
	const { verificationId } = await apiClient.request2FACode();
	return dispatch({ verificationId, uiStatus: 'OTP_FORM', nextStep: 'SET_PIN', message: '' });
}

interface IUpdatePinArgs {
	pin: string;
	cardId: string;
	verificationId?: string;
	isPCICompliant?: boolean;
}

async function updatePin(args: IUpdatePinArgs) {
	// TODO: We need to update this function to allow not having a verificationId (when client is PCI compatible)
	return apiClient.setPin({ pin: args.pin, verificationId: args.verificationId as string, cardId: args.cardId });
}

function checkIfInvalidAPIKeyError(err: unknown) {
	return String(err).includes('The mobile API key you provided is invalid');
}

function checkRequires2FACodeError(err: unknown) {
	return String(err).includes('Cardholder needs to verify their identity');
}

/**
 * When the client is not PCI compliant we need to get and validate a verification ID from the server
 *
 * If we get a verificationId we can show the OTP form otherwise show a unknown error message.
 * TODO: Better error handling
 */
async function handleNoPCICompliant(dispatch: IStateFn) {
	return apiClient
		.request2FACode()
		.then((res) => dispatch({ verificationId: res.verificationId, uiStatus: 'OTP_FORM' }))
		.catch((err) =>
			dispatch({
				isLoading: false,
				message: 'Unexpected error',
				uiStatus: 'CARD_DATA_HIDDEN',
				verificationId: '',
			})
		);
}

export default {
	hideCardData,
	isDataVisible,
	setStyle,
	setTheme,
	showCardData,
	showSetPinForm,
	updatePin,
};
