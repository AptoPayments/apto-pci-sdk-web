import apiClient, { IVerify2FACodeResponse } from 'apiClient';
import themeService from 'services/theme.service';
import IApplicationState from 'types/IApplicationState';
import ICardData from 'types/ICardData';
import IStateFn from 'types/IStateFn';
import { IStaticState } from 'types/IStaticState';
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

	// We will skip the initial request if we know the client is not PCI compliant
	if (isPCICompliant === false) {
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

interface ISetPinArgs {
	cardId: string;
	pin: string;
	// TODO: Make this optional since when the client is PCI-Compatible we don't need a verificationId)
	verificationId: string;
}

function setPin(args: ISetPinArgs) {
	return apiClient.setPin({ pin: args.pin, verificationId: args.verificationId, cardId: args.cardId });
}

interface IVerify2FACodeArgs {
	secret: string;
	dispatch: IStateFn;
	state: IApplicationState;
	staticState: IStaticState;
}

function verify2FACode(args: IVerify2FACodeArgs) {
	return apiClient
		.verify2FACode(args.secret, args.state.verificationId)
		.then((res) => _onVerificationReceived({ res, ...args }))
		.catch(() => args.dispatch({ isLoading: false, message: 'Unexpected error' }));
}

interface IOnVerificationReceivedArgs {
	res: IVerify2FACodeResponse;
	dispatch: IStateFn;
	state: IApplicationState;
	staticState: IStaticState;
}

// Callback executed when we receive a verification response from the server.
function _onVerificationReceived({ res, dispatch, state, staticState }: IOnVerificationReceivedArgs) {
	switch (res.status) {
		// 2FA token is valid. We are good to get card data using the validated secret
		case 'passed':
			if (state.nextStep === 'SET_PIN') {
				return dispatch({ uiStatus: 'SET_PIN_FORM' });
			}

			if (state.nextStep === 'VIEW_CARD_DATA') {
				return getCardData({ cardId: staticState.cardId, verificationId: state.verificationId })
					.then((cardData) => dispatch({ ...$visible(cardData) }))
					.catch(() => dispatch({ ...$hidden(staticState.lastFour), message: 'Unexpected error' }));
			}

			throw new Error(`Unexpected next step ${state.nextStep}`);

		// Timeout, we need to start again. TODO: According to the backend spec we should trigger a restart verification but works for some reason ¯\_(ツ)_/¯
		case 'expired':
			return dispatch({ ...$hidden(staticState.lastFour), message: staticState.expiredMessage });
		// Failed means too many attempts ¯\_(ツ)_/¯
		case 'failed':
			return dispatch({ ...$hidden(staticState.lastFour), message: staticState.tooManyAttemptsMessage });
		// Pending means the code is wrong but we can try again  ¯\_(ツ)_/¯
		case 'pending':
			return dispatch({ uiStatus: 'OTP_FORM', isLoading: false, message: staticState.failed2FAPrompt });
		default:
			return dispatch({ ...$hidden(staticState.lastFour), message: 'Unexpected error' });
	}
}

interface IGetCardDataArgs {
	cardId: string;
	verificationId?: string;
}

function getCardData(args: IGetCardDataArgs) {
	if (!args.verificationId) {
		return apiClient.getCardData(args.cardId);
	}
	return apiClient.getCardData(args.cardId, { verificationId: args.verificationId });
}

export default {
	getCardData,
	hideCardData,
	isDataVisible,
	setPin,
	setStyle,
	setTheme,
	showCardData,
	showSetPinForm,
	verify2FACode,
};

// Helper function to generate a hidden state
function $hidden(lastFour: string): Partial<IApplicationState> {
	return {
		message: '',
		verificationId: '',
		isLoading: false,
		cvv: '•••',
		exp: '••/••',
		pan: `•••• •••• •••• ${lastFour}`,
		uiStatus: 'CARD_DATA_HIDDEN',
	};
}

// Helper function to generate a visible state
function $visible(card: ICardData): Partial<IApplicationState> {
	return {
		message: '',
		isLoading: false,
		cvv: card.cvv,
		exp: card.exp,
		pan: card.pan,
		uiStatus: 'CARD_DATA_VISIBLE',
	};
}
