import React, { useEffect, useState } from 'react';
import apiClient from '../../apiClient';
import usePureState from '../../hooks/usePureState';
import themeService from '../../services/theme.service';
import { ITheme } from '../../types/IThemes';
import messageService from './message.service';
import themes, { IThemeName } from './themes/index';

type IUIStatus = 'CARD_DATA_VISIBLE' | 'CARD_DATA_HIDDEN' | 'OTP_FORM' | 'SET_PIN_FORM';
type INextStep = 'VIEW_CARD_DATA' | 'SET_PIN' | '';

interface IState {
	cvv: string;
	exp: string;
	isLoading: boolean;
	isVerificationIdValid: boolean;
	message: string;
	nextStep: INextStep;
	pan: string;
	theme: ITheme;
	uiStatus: IUIStatus;
	verificationId: string;
}

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
		pinPlaceholderMessage: (urlParams.get('pinPlaceholderMessage') as string) || 'Enter your new PIN',
		pinUpdatedMessage: (urlParams.get('pinUpdatedMessage') as string) || 'Pin updated successfully',
		lastFour: (urlParams.get('lastFour') as string) || '••••',
		isDebug: !!urlParams.get('debug'),
	}));

	const themeParam = urlParams.get('theme') as IThemeName;

	const { state, dispatch } = usePureState<IState>({
		cvv: '•••',
		exp: '••/••',
		uiStatus: 'CARD_DATA_HIDDEN',
		isLoading: false,
		message: '',
		pan: `•••• •••• •••• ${staticState.lastFour}`,
		theme: (themes[themeParam] as ITheme) || (themes['light' as IThemeName] as ITheme),
		verificationId: '', // Used to get the 2FA code
		isVerificationIdValid: false,
		nextStep: '',
	});

	useEffect(() => {
		function _onMessage(event: MessageEvent) {
			if (!event.data) {
				console.error(`[PCI-SDK]: iframe received unexpected event: ${event}`);
				return;
			}
			let data;
			try {
				data = JSON.parse(event.data);
			} catch (err) {
				console.error(`[PCI-SDK]: iframe received unexpected event: ${event}`);
				return;
			}

			if (!data.type) {
				console.error(`[PCI-SDK]: iframe received unexpected event: ${event}`);
				return;
			}

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
						uiStatus: 'CARD_DATA_HIDDEN',
						pan: `•••• •••• •••• ${staticState.lastFour}`,
						message: '',
						verificationId: '',
						isLoading: false,
					});
				case 'isDataVisible':
					return messageService.emitMessage({
						type: 'apto-iframe-visibility-change',
						payload: { isVisible: state.uiStatus === 'CARD_DATA_VISIBLE' },
					});
				case 'showSetPinForm':
					return _showSetPinForm();
				default:
					break;
			}
		}

		window.addEventListener('message', _onMessage, false);
		messageService.emitMessage({ type: 'apto-iframe-ready' });

		async function _showSetPinForm() {
			const { verificationId } = await apiClient.request2FACode();
			return dispatch({ verificationId, uiStatus: 'OTP_FORM', nextStep: 'SET_PIN', message: '' });
		}

		async function _showCardData(cardId: string) {
			dispatch({
				uiStatus: 'CARD_DATA_HIDDEN',
				isLoading: true,
				message: '',
				nextStep: 'VIEW_CARD_DATA',
			});

			try {
				const cardData = await apiClient.getCardData(cardId);

				if (cardData) {
					dispatch({
						cvv: cardData.cvv,
						exp: cardData.exp,
						isLoading: false,
						message: '',
						pan: cardData.pan,
						uiStatus: 'CARD_DATA_VISIBLE',
					});
				}
			} catch (err) {
				if (checkIfInvalidAPIKeyError(err)) {
					return dispatch({ message: 'Invalid API key', isLoading: false });
				}

				if (checkRequires2FACodeError(err)) {
					// Verification id failed. Lets get a new one and try again.
					try {
						const { verificationId } = await apiClient.request2FACode();
						return dispatch({ verificationId, isVerificationIdValid: false, uiStatus: 'OTP_FORM' });
					} catch (e) {
						return dispatch({
							isLoading: false,
							isVerificationIdValid: false,
							message: 'Unexpected error',
							uiStatus: 'CARD_DATA_HIDDEN',
							verificationId: '',
						});
					}
				}

				return dispatch({
					isVerificationIdValid: false,
					isLoading: false,
					message: 'Unexpected error',
					uiStatus: 'CARD_DATA_HIDDEN',
					verificationId: '',
				});
			}
		}

		return () => window.removeEventListener('message', _onMessage);
	}, [staticState, state, dispatch]);

	async function handlePinSubmit(e: React.FormEvent) {
		e.preventDefault();

		dispatch({ message: '', uiStatus: 'CARD_DATA_HIDDEN', isLoading: true });

		const pin = (e.target as any).elements['pin'].value as string;

		await apiClient
			.setPin({ pin, verificationId: state.verificationId, cardId: staticState.cardId })
			.then(() => {
				return dispatch({ isLoading: false, message: staticState.pinUpdatedMessage });
			})
			.catch(() => {
				return dispatch({
					uiStatus: 'CARD_DATA_HIDDEN',
					isLoading: false,
					message: 'Unexpected error',
				});
			});
	}

	async function handleCodeSubmit(e: React.FormEvent) {
		e.preventDefault();

		dispatch({ message: '', uiStatus: 'CARD_DATA_HIDDEN', isLoading: true });

		const secret = (e.target as any).elements['code'].value as string;
		let res = null;

		try {
			res = await apiClient.verify2FACode(secret, state.verificationId);
		} catch (e) {
			return dispatch({
				isLoading: false,
				isVerificationIdValid: false,
				message: 'Unexpected error',
				uiStatus: 'CARD_DATA_HIDDEN',
				verificationId: '',
			});
		}

		switch (res.status) {
			// 2FA token is valid. We are good to get card data using the validated secret
			case 'passed':
				if (state.nextStep === 'SET_PIN') {
					return dispatch({ uiStatus: 'SET_PIN_FORM', isVerificationIdValid: true });
				}

				if (state.nextStep === 'VIEW_CARD_DATA') {
					return apiClient
						.getCardData(staticState.cardId, { verificationId: state.verificationId })
						.then((res) => {
							return dispatch({
								cvv: res.cvv,
								exp: res.exp,
								isLoading: false,
								isVerificationIdValid: true,
								message: '',
								pan: res.pan,
								uiStatus: 'CARD_DATA_VISIBLE',
							});
						})
						.catch(() => {
							return dispatch({
								cvv: '•••',
								exp: '••/••',
								isLoading: false,
								isVerificationIdValid: false,
								message: 'Unexpected error',
								pan: `•••• •••• •••• ${staticState.lastFour}`,
								uiStatus: 'CARD_DATA_HIDDEN',
								verificationId: '',
							});
						});
				}

				throw new Error(`Unexpected next step ${state.nextStep}`);

			// Timeout, we need to start again
			case 'expired':
				return dispatch({
					cvv: '•••',
					exp: '••/••',
					uiStatus: 'CARD_DATA_HIDDEN',
					isLoading: false,
					isVerificationIdValid: false,
					message: staticState.expiredMessage,
					pan: `•••• •••• •••• ${staticState.lastFour}`,
				});
			// Failed means too many attempts ¯\_(ツ)_/¯
			case 'failed':
				return dispatch({
					cvv: '•••',
					exp: '••/••',
					uiStatus: 'CARD_DATA_HIDDEN',
					isLoading: false,
					isVerificationIdValid: false,
					message: staticState.tooManyAttemptsMessage,
					pan: `•••• •••• •••• ${staticState.lastFour}`,
					verificationId: '',
				});
			// Pending means the code is wrong but we can try again  ¯\_(ツ)_/¯
			case 'pending':
				return dispatch({
					uiStatus: 'OTP_FORM',
					isLoading: false,
					message: staticState.failed2FAPrompt,
				});
			default:
				return dispatch({
					cvv: '•••',
					exp: '••/••',
					uiStatus: 'CARD_DATA_HIDDEN',
					isLoading: false,
					isVerificationIdValid: false,
					message: 'Unexpected error',
					pan: `•••• •••• •••• ${staticState.lastFour}`,
					verificationId: '',
				});
		}
	}

	return {
		handlePinSubmit,
		handleCodeSubmit,
		...staticState,
		cvv: state.cvv,
		exp: state.exp,
		isLoading: state.isLoading,
		uiStatus: state.uiStatus,
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
