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
		tooManyAttemptsMessage: (urlParams.get('tooManyAttemptsMessage') as string) || 'Too many attempts. Start again.',
		enter2FAPrompt: (urlParams.get('enter2FAPrompt') as string) || 'Enter the code we sent you (numbers only).',
		failed2FAPrompt: (urlParams.get('failed2FAPrompt') as string) || 'Wrong code. Try again.',
		codePlaceholderMessage: (urlParams.get('codePlaceholderMessage') as string) || 'Enter the code',
		lastFour: (urlParams.get('lastFour') as string) || '••••',
		isDebug: !!urlParams.get('debug'),
	}));

	const themeParam = urlParams.get('theme') as IThemeName;

	const { state, dispatch } = usePureState({
		cvv: '•••',
		exp: '••/••',
		isDataVisible: false,
		isFormVisible: false,
		isLoading: false,
		message: '',
		pan: `•••• •••• •••• ${staticState.lastFour}`,
		theme: (themes[themeParam] as ITheme) || (themes['light' as IThemeName] as ITheme),
		verificationId: '', // Used to get the 2FA code
	});

	useEffect(() => {
		function _onMessage(event: MessageEvent) {
			if (!event?.data) {
				console.error(`[PCI-SDK]: iframe received unexpected event: ${event}`);
				return;
			}

			const data = event?.data ? JSON.parse(event.data) : {};

			switch (data.type) {
				case 'setStyle':
					return dispatch({ theme: themeService.extendTheme(data.style) });
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
						isFormVisible: false,
						verificationId: '',
						isLoading: false,
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
			dispatch({
				isDataVisible: false,
				isLoading: true,
				message: '',
				verificationId: '',
				isFormVisible: false,
			});

			try {
				// When the client is pci compatible the server will return valid data
				const cardData = await apiClient.getCardData(cardId);
				if (cardData) {
					dispatch({
						cvv: cardData.cvv as string,
						exp: cardData.exp as string,
						isDataVisible: true,
						isFormVisible: false,
						isLoading: false,
						pan: cardData.pan as string,
						verificationId: '',
						message: '',
					});
				}
			} catch (err) {
				if (checkIfInvalidAPIKeyError(err)) {
					return dispatch({ message: 'Invalid API key', isLoading: false });
				}

				if (checkRequires2FACodeError(err)) {
					try {
						const { verificationId } = await apiClient.request2FACode();
						return dispatch({ verificationId, isFormVisible: true });
					} catch (e) {
						dispatch({
							isDataVisible: false,
							isFormVisible: false,
							isLoading: false,
							message: 'Unexpected error',
						});
					}
				}

				dispatch({
					isDataVisible: false,
					isFormVisible: false,
					isLoading: false,
					message: err?.message || 'Unexpected error',
				});
			}
		}

		return () => window.removeEventListener('message', _onMessage);
	}, [staticState, state, dispatch]);

	async function handleCodeSubmit(e: React.FormEvent) {
		e.preventDefault();

		dispatch({ message: '', isFormVisible: false, isLoading: true });

		const secret = (e.target as any).elements['code'].value as string;
		let res = null;

		try {
			res = await apiClient.verify2FACode(secret, state.verificationId);
		} catch (e) {
			return dispatch({
				isDataVisible: false,
				isFormVisible: false,
				isLoading: false,
				message: e?.message || 'Unexpected error',
			});
		}

		switch (res.status) {
			// 2FA token is valid. We are good to get card data using the validated secret
			case 'passed':
				return apiClient
					.getCardData(staticState.cardId, { verificationId: state.verificationId, secret })
					.then((res) => {
						dispatch({
							cvv: res.cvv as string,
							exp: res.exp as string,
							isLoading: false,
							pan: res.pan as string,
							verificationId: '',
							isFormVisible: false,
							isDataVisible: true,
							message: '',
						});
					})
					.catch(() => {
						dispatch({
							exp: '••/••',
							isDataVisible: false,
							isFormVisible: false,
							isLoading: false,
							message: 'Unexpected error',
							verificationId: '',
							cvv: '•••',
							pan: `•••• •••• •••• ${staticState.lastFour}`,
						});
					});
			// Timeout, we need to start again
			case 'expired':
				return dispatch({
					cvv: '•••',
					exp: '••/••',
					isDataVisible: false,
					isFormVisible: false,
					isLoading: false,
					message: staticState.expiredMessage,
					pan: `•••• •••• •••• ${staticState.lastFour}`,
				});
			// Failed means too many attempts ¯\_(ツ)_/¯
			case 'failed':
				return dispatch({
					cvv: '•••',
					exp: '••/••',
					isDataVisible: false,
					isFormVisible: false,
					isLoading: false,
					message: staticState.tooManyAttemptsMessage,
					pan: `•••• •••• •••• ${staticState.lastFour}`,
					verificationId: '',
				});
			// Pending means the code is wrong  ¯\_(ツ)_/¯
			case 'pending':
				return dispatch({
					isDataVisible: false,
					isFormVisible: true,
					isLoading: false,
					message: staticState.failed2FAPrompt,
					exp: '••/••',
					pan: `•••• •••• •••• ${staticState.lastFour}`,
					cvv: '•••',
				});
			default:
				return dispatch({
					isDataVisible: false,
					isFormVisible: false,
					isLoading: false,
					message: 'Unexpected error',
					verificationId: '',
					exp: '••/••',
					pan: `•••• •••• •••• ${staticState.lastFour}`,
					cvv: '•••',
				});
		}
	}

	return {
		handleCodeSubmit,
		...staticState,
		cvv: state.cvv,
		exp: state.exp,
		isLoading: state.isLoading,
		isFormVisible: state.isFormVisible,
		message: state.message,
		pan: state.pan,
		theme: state.theme,
		verificationId: state.verificationId,
	};
}

function checkIfInvalidAPIKeyError(err: unknown) {
	return String(err).includes('The mobile API key you provided is invalid');
}

function checkRequires2FACodeError(err: unknown) {
	return String(err).includes('Cardholder needs to verify their identity');
}
