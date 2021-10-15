import apiClient, { IVerify2FACodeResponse } from 'apiClient';
import IApplicationState from 'types/IApplicationState';
import ICardData from 'types/ICardData';
import { IInitialState } from 'types/IInitialState';
import IStateFn from 'types/IStateFn';
import cardDataService from './cardData.service';

interface IVerify2FACodeArgs {
	secret: string;
	dispatch: IStateFn;
	state: IApplicationState;
	initialState: IInitialState;
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
	initialState: IInitialState;
}

// Callback executed when we receive a verification response from the server.
function _onVerificationReceived({ res, dispatch, state, initialState }: IOnVerificationReceivedArgs) {
	switch (res.status) {
		// 2FA token is valid. We are good to get card data using the validated secret
		case 'passed':
			if (state.nextStep === 'SET_PIN') {
				return dispatch({ uiStatus: 'SET_PIN_FORM' });
			}

			if (state.nextStep === 'VIEW_CARD_DATA') {
				return cardDataService
					.getCardData({ cardId: initialState.cardId, verificationId: state.verificationId })
					.then((cardData) => dispatch({ ...$visible(cardData) }))
					.catch(() => dispatch({ ...$hidden(initialState.lastFour), message: 'Unexpected error' }));
			}

			throw new Error(`Unexpected next step ${state.nextStep}`);

		// Timeout, we need to start again. TODO: According to the backend spec we should trigger a restart verification but works for some reason ¯\_(ツ)_/¯
		case 'expired':
			return dispatch({ ...$hidden(initialState.lastFour), message: initialState.expiredMessage });
		// Failed means too many attempts ¯\_(ツ)_/¯
		case 'failed':
			return dispatch({ ...$hidden(initialState.lastFour), message: initialState.tooManyAttemptsMessage });
		// Pending means the code is wrong but we can try again  ¯\_(ツ)_/¯
		case 'pending':
			return dispatch({ uiStatus: 'OTP_FORM', isLoading: false, message: initialState.failed2FAPrompt });
		default:
			return dispatch({ ...$hidden(initialState.lastFour), message: 'Unexpected error' });
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
