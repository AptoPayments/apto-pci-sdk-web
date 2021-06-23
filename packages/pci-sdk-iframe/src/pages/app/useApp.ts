import { useEffect, useReducer, useState } from 'react';
import themeService from '../../services/theme.service';
import ICardData from '../../types/ICardData';
import messageService from './message.service';
import reducer from './reducer';
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
	}));

	const themeParam = urlParams.get('theme') as IThemeName;
	const [state, dispatch] = useReducer(reducer, {
		cvv: '•••',
		exp: '••/••',
		isDataVisible: false,
		networkStatus: 'IDLE',
		pan: `•••• •••• •••• ${staticState.lastFour}`,
		theme: themes[themeParam] || themes['light' as IThemeName],
	});

	useEffect(() => {
		function _onMessage(event: MessageEvent) {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case 'setStyle':
					return dispatch({
						type: 'SET_THEME',
						payload: { theme: themeService.extendTheme(data.style) },
					});
				case 'setTheme':
					return dispatch({
						type: 'SET_THEME',
						payload: { theme: themes[data.theme as IThemeName] },
					});
				case 'showCardData':
					dispatch({ type: 'SET_LOADING' });

					setTimeout(() => {
						const cardData: ICardData = {
							cvv: '123',
							exp: '10/23',
							pan: '5555 6666 7777 8888',
						};

						dispatch({ type: 'SET_CARD_DATA', payload: cardData });
					}, 800);
					return;
				case 'hideCardData':
					return dispatch({
						type: 'HIDE_DATA',
						payload: { lastFour: staticState.lastFour },
					});
				case 'isDataVisible':
					return dispatch({ type: 'EMIT_VISIBILITY_MESSAGE' });
				default:
					break;
			}
		}

		window.addEventListener('message', _onMessage, false);
		messageService.emitMessage({ type: 'apto-iframe-ready' });
		return () => window.removeEventListener('message', _onMessage);
	}, [staticState]);

	return {
		cvv: state.cvv,
		exp: state.exp,
		isLoading: state.networkStatus === 'PENDING',
		...staticState,
		pan: state.pan,
		theme: state.theme,
	};
}
