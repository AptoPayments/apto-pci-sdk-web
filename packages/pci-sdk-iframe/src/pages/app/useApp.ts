import apiClient, { IVerify2FACodeResponse } from 'apiClient';
import useApplicationState from 'hooks/useApplicationState';
import useStaticState from 'hooks/useStaticState';
import { useEffect } from 'react';
import eventService from 'services/event.service';
import IApplicationState from 'types/IApplicationState';
import ICardData from 'types/ICardData';
import appService from './app.service';
import messageService from './message.service';

export default function useApp() {
	const staticState = useStaticState();
	const { state, dispatch } = useApplicationState(staticState);

	// When the sdk is mounted we set a message listener.
	useEffect(() => {
		function _onMessage(event: MessageEvent) {
			const data = eventService.parse(event);
			switch (data.type) {
				case 'setStyle':
					return appService.setStyle({ dispatch, style: data.style });
				case 'setTheme':
					return appService.setTheme({ dispatch, theme: data.theme });
				case 'showCardData':
					return appService.showCardData({ dispatch, ...staticState });
				case 'hideCardData':
					return appService.hideCardData({ dispatch, lastFour: staticState.lastFour });
				case 'isDataVisible':
					return appService.isDataVisible({ dispatch, isVisible: state.uiStatus === 'CARD_DATA_VISIBLE' });
				case 'showSetPinForm':
					return appService.showSetPinForm({ dispatch });
				default:
					break;
			}
		}

		window.addEventListener('message', _onMessage, false);
		messageService.emitMessage({ type: 'apto-iframe-ready' });

		return () => window.removeEventListener('message', _onMessage);
	}, [dispatch, state, staticState]); // All deps are stable

	/**
	 * Callback to be executed when the setPin form is submitted
	 * In order to view the setPinForm we must have a valid verification ID.
	 */
	async function handlePinSubmit(e: React.FormEvent) {
		e.preventDefault();
		dispatch({ message: '', uiStatus: 'CARD_DATA_HIDDEN', isLoading: true });
		const pin = (e.target as any).elements['pin'].value as string;

		await apiClient
			.setPin({ pin, verificationId: state.verificationId, cardId: staticState.cardId })
			.then(() => dispatch({ isLoading: false, message: staticState.pinUpdatedMessage }))
			.catch(() => dispatch({ uiStatus: 'CARD_DATA_HIDDEN', isLoading: false, message: 'Unexpected error' }));
	}

	// Callback to be executed when the verify OTP form is submitted
	async function handleCodeSubmit(e: React.FormEvent) {
		e.preventDefault();
		dispatch({ message: '', uiStatus: 'CARD_DATA_HIDDEN', isLoading: true });
		const secret = (e.target as any).elements['code'].value as string;

		apiClient
			.verify2FACode(secret, state.verificationId)
			.then(_onVerificationReceived)
			.catch(() => dispatch({ ...$hidden(staticState.lastFour), message: 'Unexpected error' }));
	}

	// Callback executed when we receive a verification response from the server.
	function _onVerificationReceived(res: IVerify2FACodeResponse) {
		switch (res.status) {
			// 2FA token is valid. We are good to get card data using the validated secret
			case 'passed':
				if (state.nextStep === 'SET_PIN') {
					return dispatch({ uiStatus: 'SET_PIN_FORM' });
				}

				if (state.nextStep === 'VIEW_CARD_DATA') {
					return apiClient
						.getCardData(staticState.cardId, { verificationId: state.verificationId })
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

	return { handleCodeSubmit, handlePinSubmit, ...staticState, ...state };
}

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
