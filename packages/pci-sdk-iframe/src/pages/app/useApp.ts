import useApplicationState from 'hooks/useApplicationState';
import useStaticState from 'hooks/useStaticState';
import { useEffect } from 'react';
import eventService from 'services/event.service';
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
	function handlePinSubmit(e: React.FormEvent) {
		e.preventDefault();
		dispatch({ message: '', uiStatus: 'CARD_DATA_HIDDEN', isLoading: true });
		const pin = (e.target as any).elements['pin'].value as string;

		return appService
			.setPin({ pin, verificationId: state.verificationId, cardId: staticState.cardId })
			.then(() => dispatch({ isLoading: false, message: staticState.pinUpdatedMessage }))
			.catch(() => dispatch({ uiStatus: 'CARD_DATA_HIDDEN', isLoading: false, message: 'Unexpected error' }));
	}

	// Callback to be executed when the verify OTP form is submitted
	function handleCodeSubmit(e: React.FormEvent) {
		e.preventDefault();
		dispatch({ message: '', uiStatus: 'CARD_DATA_HIDDEN', isLoading: true });
		const secret = (e.target as any).elements['code'].value as string;

		return appService.verify2FACode({ secret, state, staticState, dispatch });
	}

	return { handleCodeSubmit, handlePinSubmit, ...staticState, ...state };
}
