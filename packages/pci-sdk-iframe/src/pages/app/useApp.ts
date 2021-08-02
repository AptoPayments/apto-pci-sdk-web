import React, { useEffect, useState } from 'react';
import apiClient from '../../apiClient';
import usePureState from '../../hooks/usePureState';
import themeService from '../../services/theme.service';
import { ITheme } from '../../types/IThemes';
import messageService from './message.service';
import themes, { IThemeName } from './themes/index';

export default function useApp() {
	const urlParams = new URLSearchParams(window.location.search);

	const [staticState] = useState(() => ({
		cardId: (urlParams.get('cardId') as string) || '',
		labelCvv: (urlParams.get('labelCvv') as string) || 'Cvv',
		labelExp: (urlParams.get('labelExp') as string) || 'Exp',
		labelName: (urlParams.get('labelName') as string) || 'Name',
		labelPan: (urlParams.get('labelPan') as string) || 'Card number',
		nameOnCard: (urlParams.get('nameOnCard') as string) || '',
		expiredMessage: (urlParams.get('expiredMessage') as string) || 'Process expired. Start again.',
		tooManyAttemptsMessage: (urlParams.get('tooManyAttemptsMessage') as string) || 'Too many attempts, try again.',
		enter2FAPrompt: (urlParams.get('enter2FAPrompt') as string) || 'Enter the code we sent you (numbers only):',
		failed2FAPrompt: (urlParams.get('failed2FAPrompt') as string) || 'Wrong code. try again:',
		lastFour: (urlParams.get('lastFour') as string) || '••••',
		isDebug: !!urlParams.get('debug'),
	}));

	const themeParam = urlParams.get('theme') as IThemeName;

	const { state, dispatch } = usePureState({
		cvv: '•••',
		exp: '••/••',
		isDataVisible: false,
		networkStatus: 'IDLE',
		pan: `•••• •••• •••• ${staticState.lastFour}`,
		theme: (themes[themeParam] as ITheme) || (themes['light' as IThemeName] as ITheme),
		verificationId: '', // Used to get the 2FA code
		message: '',
	});

	useEffect(() => {
		function _onMessage(event: MessageEvent) {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case 'setStyle':
					// TODO: Investigate this any
					return dispatch({ theme: themeService.extendTheme(data.style) as any });
				case 'setTheme':
					return dispatch({ theme: themes[data.theme as IThemeName] });
				case 'showCardData':
					return _showCardData(staticState.cardId);
				case 'hideCardData':
					return dispatch({
						cvv: '•••',
						exp: '••/••',
						isDataVisible: false,
						pan: `•••• •••• •••• ${staticState.lastFour}`,
						message: '',
					});
				case 'isDataVisible':
					return messageService.emitMessage({
						type: 'apto-iframe-visibility-change',
						payload: { isVisible: state.isDataVisible },
					});
				default:
					break;
			}
		}

		window.addEventListener('message', _onMessage, false);
		messageService.emitMessage({ type: 'apto-iframe-ready' });

		async function _showCardData(cardId: string) {
			dispatch({ isDataVisible: false, networkStatus: 'PENDING' });

			try {
				const cardData = await apiClient.getCardData(cardId);

				if (cardData) {
					dispatch({
						cvv: cardData.cvv as string,
						exp: cardData.exp as string,
						isDataVisible: true,
						networkStatus: 'SUCCESS',
						pan: cardData.pan as string,
						verificationId: '',
					});
				}
			} catch (err) {
				const { verificationId } = await apiClient.request2FACode();
				// When the verification id is not empty the UI will ask for the 2FA code
				dispatch({ verificationId });
			}
		}

		return () => window.removeEventListener('message', _onMessage);
	}, [staticState, state, dispatch]);

	/**
	 *
	 */
	async function handleCodeSubmit(e: React.FormEvent) {
		e.preventDefault();

		const secret = (e.target as any).elements['code'].value as string;
		const { status } = await apiClient.verify2FACode(secret, state.verificationId);

		switch (status) {
			// 2FA token is valid. We are good to get card data using the validated secret
			case 'passed':
				return apiClient
					.getCardData(staticState.cardId, { verificationId: state.verificationId, secret })
					.then((res) => {
						dispatch({
							cvv: res.cvv as string,
							exp: res.exp as string,
							isDataVisible: true,
							networkStatus: 'SUCCESS',
							pan: res.pan as string,
							verificationId: '',
						});
					})
					.catch(() => {
						dispatch({
							networkStatus: 'ERROR',
							isDataVisible: false,
							message: '',
							verificationId: '',
						});
					});
			// Timeout, we need to start again
			case 'expired':
				return dispatch({ message: staticState.expiredMessage });
			// Failed means too many attempts ¯\_(ツ)_/¯
			case 'failed':
				return dispatch({ message: staticState.tooManyAttemptsMessage });
			// Pending means the code is wrong  ¯\_(ツ)_/¯
			case 'pending':
				return dispatch({ message: staticState.failed2FAPrompt });
			default:
				return dispatch({ message: 'Unexpected error.' });
		}
	}

	return {
		handleCodeSubmit,
		...staticState,
		cvv: state.cvv,
		exp: state.exp,
		isLoading: state.networkStatus === 'PENDING',
		message: state.message,
		pan: state.pan,
		theme: state.theme,
		verificationId: state.verificationId,
	};
}
