import apiClient, { IVerify2FACodeResponse } from 'apiClient';
import IApplicationState from 'types/IApplicationState';
import ICardData from 'types/ICardData';
import { IConfigOptions } from 'types/IConfigOptions';
import IStateFn from 'types/IStateFn';
import cardDataService from './cardData.service';

interface IVerify2FACodeArgs {
	secret: string;
	dispatch: IStateFn;
	state: IApplicationState;
	configOptions: IConfigOptions;
}

function verify2FACode(args: IVerify2FACodeArgs) {
	return apiClient
		.verify2FACode(args.secret, args.state.verificationId)
		.then((res) => _onVerificationReceived({ res, ...args }))
		.catch(() =>
			args.dispatch({ isLoading: false, message: 'Unexpected error. Try again.', notificationType: 'negative' })
		);
}

interface IOnVerificationReceivedArgs {
	res: IVerify2FACodeResponse;
	dispatch: IStateFn;
	state: IApplicationState;
	configOptions: IConfigOptions;
}

// Callback executed when we receive a verification response from the server.
function _onVerificationReceived({ res, dispatch, state, configOptions }: IOnVerificationReceivedArgs) {
	switch (res.status) {
		// 2FA token is valid. We are good to get card data using the validated secret
		case 'passed':
			if (state.nextStep === 'SET_PIN') {
				return dispatch({ uiStatus: 'SET_PIN_FORM' });
			}

			if (state.nextStep === 'VIEW_CARD_DATA') {
				return cardDataService
					.getCardData({ cardId: configOptions.card.cardId, verificationId: state.verificationId })
					.then((cardData) => dispatch({ ...$visible(cardData) }))
					.catch(() =>
						dispatch({
							...$hidden(configOptions.card.lastFour),
							message: 'Unexpected error. Try again.',
							notificationType: 'negative',
						})
					);
			}

			throw new Error(`Unexpected next step ${state.nextStep}`);

		// Timeout, we need to start again. TODO: According to the backend spec we should trigger a restart verification but works for some reason ¯\_(ツ)_/¯
		case 'expired':
			return dispatch({
				...$hidden(configOptions.card.lastFour),
				message: configOptions.messages.expired2FA,
				notificationType: 'negative',
			});
		// Failed means too many attempts ¯\_(ツ)_/¯
		case 'failed':
			return dispatch({
				...$hidden(configOptions.card.lastFour),
				message: configOptions.messages.tooManyAttempts,
				notificationType: 'negative',
			});
		// Pending means the code is wrong but we can try again  ¯\_(ツ)_/¯
		case 'pending':
			return dispatch({
				uiStatus: 'OTP_FORM',
				isLoading: false,
				message: configOptions.messages.failed2FA,
				notificationType: 'negative',
			});
		default:
			return dispatch({
				...$hidden(configOptions.card.lastFour),
				message: 'Unexpected error. Try again.',
				notificationType: 'negative',
			});
	}
}

export default {
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
