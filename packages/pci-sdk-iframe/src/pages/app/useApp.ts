import useApplicationState from 'hooks/useApplicationState';
import useConfigOptions from 'hooks/useConfigOptions';
import { useEffect } from 'react';
import appService from 'services/app.service';

export default function useApp() {
	const configOptions = useConfigOptions();
	const { state, dispatch } = useApplicationState(configOptions);

	// When the sdk is mounted we set a message listener.
	useEffect(() => {
		function _onMessage(event: MessageEvent) {
			const data = appService.event.parse(event);
			switch (data.type) {
				case 'setStyle':
					return appService.theme.setStyle({ dispatch, style: data.style });
				case 'setTheme':
					return appService.theme.setTheme({ dispatch, theme: data.theme });
				case 'showCardData':
					return appService.cardData.showCardData({
						dispatch,
						cardId: configOptions.card.cardId,
						isPCICompliant: configOptions.config.isPCICompliant,
					});
				case 'hideCardData':
					return appService.cardData.hideCardData({ dispatch, lastFour: configOptions.card.lastFour });
				case 'isDataVisible':
					return appService.cardData.isDataVisible({ dispatch, isVisible: state.uiStatus === 'CARD_DATA_VISIBLE' });
				case 'showSetPinForm':
					return appService.pin.showSetPinForm({ dispatch });
				default:
					break;
			}
		}

		window.addEventListener('message', _onMessage, false);
		appService.message.emitMessage({ type: 'apto-iframe-ready' });

		return () => window.removeEventListener('message', _onMessage);
	}, [dispatch, state, configOptions]); // All deps are stable

	/**
	 * Callback to be executed when the setPin form is submitted
	 * In order to view the setPinForm we must have a valid verification ID.
	 */
	function handlePinSubmit(e: React.FormEvent) {
		e.preventDefault();
		dispatch({ message: '', uiStatus: 'CARD_DATA_HIDDEN', isLoading: true });
		const pin = (e.target as any).elements['pin-input'].value as string;

		return appService.pin
			.setPin({ pin, verificationId: state.verificationId, cardId: configOptions.card.cardId })
			.then(() => dispatch({ isLoading: false, message: configOptions.messages.pinUpdated, notificationType: 'positive' }))
			.catch(() =>
				dispatch({
					uiStatus: 'CARD_DATA_HIDDEN',
					isLoading: false,
					message: 'Unexpected error. Contact support.',
					notificationType: 'negative',
				})
			);
	}

	// Callback to be executed when the verify OTP form is submitted
	function handleCodeSubmit(e: React.FormEvent) {
		e.preventDefault();
		dispatch({ message: '', uiStatus: 'CARD_DATA_HIDDEN', isLoading: true });
		const secret = (e.target as any).elements['otp-input'].value as string;

		return appService.twoFactorAuth.verify2FACode({ secret, state, configOptions, dispatch });
	}

	return { handleCodeSubmit, handlePinSubmit, ...configOptions, ...state };
}
