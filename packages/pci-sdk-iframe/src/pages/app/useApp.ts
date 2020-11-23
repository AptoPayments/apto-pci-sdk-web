import { useEffect, useReducer } from 'react';
import themeService from '../../services/theme.service';
import appService from './app.service';
import messageService from './message.service';
import reducer from './reducer';
import themes, { IThemeName } from './themes/index';



export default function useApp() {
	const urlParams = new URLSearchParams(window.location.search);

	const cardId = urlParams.get('cardId') as string || '';
	const labelCvv = urlParams.get('labelCvv') as string || 'Cvv';
	const labelExp = urlParams.get('labelExp') as string || 'Exp';
	const labelName = urlParams.get('labelName') as string || 'Name';
	const labelPan = urlParams.get('labelPan') as string || 'Card number';
	const nameOnCard = urlParams.get('nameOnCard') as string || '';
	const lastFour = urlParams.get('lastFour') as string || '••••';

	const themeParam = urlParams.get('theme') as IThemeName;
	const [state, dispatch] = useReducer(reducer, {
		cvv: '•••',
		exp: '••/••',
		isDataVisible: false,
		networkStatus: 'IDLE',
		pan: `•••• •••• •••• ${lastFour}`,
		theme: themes[themeParam] || themes['light' as IThemeName],
	});

	useEffect(() => {
		function _onMessage(event: MessageEvent) {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case 'setStyle':
					return dispatch({ type: 'SET_THEME', payload: { theme: themeService.extendTheme(data.style) } });
				case 'setTheme':
					return dispatch({ type: 'SET_THEME', payload: { theme: themes[data.theme as IThemeName] } });
				case 'showCardData':
					dispatch({ type: 'SET_LOADING' });
					return appService.showCardData(cardId)
						.then(cardData => dispatch({ type: 'SET_CARD_DATA', payload: cardData }))
						.catch(() => dispatch({ type: 'SET_ERROR' }));
				case 'hideCardData':
					return dispatch({ type: 'HIDE_DATA', payload: { lastFour } });
				case 'isDataVisible':
					return dispatch({ type: 'EMIT_VISIBILITY_MESSAGE' });
				default:
					break;
			}
		}

		window.addEventListener('message', _onMessage, false);
		messageService.emitMessage({ type: 'apto-iframe-ready' });
		return () => window.removeEventListener('message', _onMessage);
	}, [cardId, lastFour]);


	return {
		cvv: state.cvv,
		exp: state.exp,
		isLoading: state.networkStatus === 'PENDING',
		labelCvv,
		labelExp,
		labelName,
		labelPan,
		nameOnCard,
		pan: state.pan,
		theme: state.theme,
	};
}
