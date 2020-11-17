import { useEffect, useState } from 'react';
import apiClient from '../../apiClient';
import formatterService from '../../services/formatter.service';
import themeService from '../../services/theme.service';
import { ITheme } from '../../types/IThemes';
import themes, { IThemeName } from './themes/index';


interface IState {
	cardId: string;
	cvv: string;
	exp: string;
	labelCvv: string;
	labelExp: string;
	labelName: string;
	labelPan: string;
	lastFour: string;
	nameOnCard: string;
	networkStatus: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED',
	pan: string;
	theme: ITheme;
}

export default function useApp() {
	const urlParams = new URLSearchParams(window.location.search);
	const themeParam = urlParams.get('theme') as IThemeName;
	const [state, setState] = useState<IState>({
		cardId: urlParams.get('cardId') as string || '',
		cvv: '•••',
		exp: '••/••',
		labelCvv: urlParams.get('labelCvv') as string || 'Cvv',
		labelExp: urlParams.get('labelExp') as string || 'Exp',
		labelName: urlParams.get('labelName') as string || 'Name',
		labelPan: urlParams.get('labelPan') as string || 'Card number',
		lastFour: urlParams.get('lastFour') as string || '••••',
		nameOnCard: urlParams.get('nameOnCard') as string || '',
		networkStatus: 'IDLE',
		pan: `•••• •••• •••• ${urlParams.get('lastFour') as string || '••••'}`,
		theme: themes[themeParam] || themes['light' as IThemeName],
	});

	useEffect(() => {
		function onMessage(event: MessageEvent) {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case 'setStyle':
					const style = themeService.extendTheme(data.style);
					return setState(s => ({ ...s, theme: style }));
				case 'setTheme':
					return setState(s => ({ ...s, theme: themes[data.theme as IThemeName] }));
				case 'showCardData':
					return showCardData(state.cardId);
				case 'hideCardData':
					return setState(s => ({ ...s, networkStatus: 'SUCCESS', pan: `•••• •••• •••• ${s.lastFour}`, cvv: '•••', exp: '••/••' }));
				default:
					break;
			}
		}

		async function showCardData(cardId: string) {
			setState(s => ({ ...s, networkStatus: 'PENDING' }));

			// Try to get card data from the server
			return apiClient.getCardData(cardId)
				// If data is obtained just display it. We are done
				.then(res => {
					setState(s => ({ ...s, networkStatus: 'SUCCESS', ...res }));
				})
				.catch(err => {
					// Otherwise we request a 2FA code
					return apiClient.request2FACode()
						// If request goes well we init the verify2FA code and we'll fetch card data again with this code attached
						.then(res => _verify2FACode(res.verificationId, false))
						// If 2fa request goes wrong we just give up
						.catch(err => {
							setState(s => ({ ...s, networkStatus: 'FAILED' }));
						});
				});

		}

		async function _verify2FACode(verificationId: string, isSecondTime: boolean): Promise<void> {
			const codeEntered = window.prompt(isSecondTime ? 'Wrong code. try again:' : 'Enter the code we sent you (numbers only):');
			const secret = formatterService.sanitize2FACode(codeEntered);

			if (!secret) {
				return setState(s => ({ ...s, networkStatus: 'IDLE' }));
			}

			return apiClient.verify2FACode(secret, verificationId)
				.then(res => {
					switch (res.status) {
						case 'passed':
							return _getCardDataWithSecret(verificationId, secret);
						case 'expired':
							return _onExpired();
						case 'failed':
							return _tooManyAttempts();
						case 'pending':
							return _verify2FACode(verificationId, true);
					}
				});


			function _getCardDataWithSecret(verificationId: string, secret: string) {
				return apiClient.getCardData(state.cardId, { verificationId, secret })
					.then(cardData => {
						return setState(s => ({ ...s, networkStatus: 'SUCCESS', ...cardData }));
					})
					.catch(() => {
						return setState(s => ({ ...s, networkStatus: 'FAILED' }));
					});
			}

			function _tooManyAttempts() {
				alert('Too many attempts, try again.');
				return setState(s => ({ ...s, networkStatus: 'IDLE' }));
			}

			function _onExpired() {
				alert('Process expired. Start again.');
				return setState(s => ({ ...s, networkStatus: 'IDLE' }));
			}
		}

		window.addEventListener('message', onMessage, false);
		if (window.self !== window.parent) {
			window.parent.postMessage('apto-iframe-ready', '*'); // TODO: Investigate how to filter by parent CORS domain
		}
		return () => window.removeEventListener('message', onMessage);
	}, [state.cardId]);


	return {
		state,
		isLoading: state.networkStatus === 'PENDING',
	};
}
