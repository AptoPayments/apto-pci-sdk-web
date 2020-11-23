import { useEffect, useReducer } from 'react';
import themeService from '../../services/theme.service';
import { ITheme } from '../../types/IThemes';
import appService from './app.service';
import themes, { IThemeName } from './themes/index';



export interface ICardData {
	cardId: string;
	cvv: string;
	exp: string;
	pan: string;
}
interface IState extends ICardData {
	labelCvv: string;
	labelExp: string;
	labelName: string;
	labelPan: string;
	lastFour: string;
	nameOnCard: string;
	networkStatus: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED',
	theme: ITheme;
	isDataVisible: boolean;
}

interface IMessage {
	type: 'apto-iframe-ready' | 'apto-iframe-visibility-change';
	data?: Record<string, unknown>;
}

type IAction = 'HIDE_DATA' | 'EMIT_VISIBILITY_MESSAGE' | 'ERROR';


export default function useApp() {
	const urlParams = new URLSearchParams(window.location.search);
	const themeParam = urlParams.get('theme') as IThemeName;
	const [state, dispatch] = useReducer(reducer, {
		cardId: urlParams.get('cardId') as string || '',
		cvv: '•••',
		exp: '••/••',
		isDataVisible: false,
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
		function _onMessage(event: MessageEvent) {
			const data = JSON.parse(event.data);
			switch (data.type) {
				case 'setStyle':
					const style = themeService.extendTheme(data.style);
					return dispatch({ theme: style });
				case 'setTheme':
					return dispatch({ theme: themes[data.theme as IThemeName] });
				case 'showCardData':
					return appService.showCardData(state.cardId)
						.then(cardData => dispatch(cardData))
						.catch(() => dispatch('ERROR'));
				case 'hideCardData':
					return dispatch('HIDE_DATA');
				case 'isDataVisible':
					return dispatch('EMIT_VISIBILITY_MESSAGE');
				default:
					break;
			}
		}

		window.addEventListener('message', _onMessage, false);
		_emitMessage({ type: 'apto-iframe-ready' });
		return () => window.removeEventListener('message', _onMessage);
	}, [state.cardId]);


	return {
		state,
		isLoading: state.networkStatus === 'PENDING',
	};
}


function reducer(state: IState, action: Partial<IState> | IAction): IState {
	if (typeof action === 'string') {
		switch (action) {
			case 'HIDE_DATA':
				return { ...state, pan: `•••• •••• •••• ${state.lastFour}` };
			case 'EMIT_VISIBILITY_MESSAGE':
				_emitMessage({ type: 'apto-iframe-visibility-change', data: { isVisible: state.isDataVisible } });
				return state;
			case 'ERROR':
				return { ...state, networkStatus: 'FAILED', isDataVisible: false, };
			default:
				throw new Error(`Unexpected action ${action}`);
		}
	}
	return { ...state, ...action };
}

function _emitMessage(message: IMessage) {
	if (window.self !== window.parent) {
		window.parent.postMessage(JSON.stringify(message), '*'); // TODO: Investigate how to filter by parent CORS domain
	}
}
