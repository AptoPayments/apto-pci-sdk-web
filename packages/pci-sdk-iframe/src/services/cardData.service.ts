import apiClient from 'apiClient';
import IStateFn from 'types/IStateFn';
import messageService from './message.service';

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
		return _handleNoPCICompliant(dispatch);
	}

	return apiClient
		.getCardData(cardId)
		.then((card) => dispatch({ ...card, isLoading: false, message: '', uiStatus: 'CARD_DATA_VISIBLE' }))
		.catch((err) => {
			if (_checkIfInvalidAPIKeyError(err)) {
				return dispatch({
					message: 'Invalid mobile API key. Refer to the Developer Portal for a valid key.',
					uiStatus: 'CARD_DATA_HIDDEN',
					isLoading: false,
					notificationType: 'negative',
				});
			}

			if (_checkRequires2FACodeError(err)) {
				return _handleNoPCICompliant(dispatch);
			}

			return dispatch({
				isLoading: false,
				message: 'Unexpected error. Try again.',
				notificationType: 'negative',
				uiStatus: 'CARD_DATA_HIDDEN',
				verificationId: '',
			});
		});
}

function _checkIfInvalidAPIKeyError(err: unknown) {
	return String(err).includes('The mobile API key you provided is invalid');
}

function _checkRequires2FACodeError(err: unknown) {
	return String(err).includes('Cardholder needs to verify their identity');
}

/**
 * When the client is not PCI compliant we need to get and validate a verification ID from the server
 *
 * If we get a verificationId we can show the OTP form otherwise show a unknown error message.
 * TODO: Better error handling
 */
async function _handleNoPCICompliant(dispatch: IStateFn) {
	return apiClient
		.request2FACode()
		.then((res) => dispatch({ verificationId: res.verificationId, uiStatus: 'OTP_FORM' }))
		.catch((err) =>
			dispatch({
				isLoading: false,
				message: 'Unexpected error. Contact support.',
				notificationType: 'negative',
				uiStatus: 'CARD_DATA_HIDDEN',
				verificationId: '',
			})
		);
}

export default {
	getCardData,
	hideCardData,
	isDataVisible,
	showCardData,
};
