import IAction from '../../types/IAction';
import IState from '../../types/IState';
import { ITheme } from '../../types/IThemes';
import messageService from './message.service';

export default function reducer(state: IState, action: IAction): IState {
	switch (action.type) {
		case 'SET_LOADING':
			return { ...state, isDataVisible: false, networkStatus: 'PENDING' };
		case 'SET_CARD_DATA':
			return {
				...state,
				cvv: action.payload.cvv as string,
				exp: action.payload.exp as string,
				isDataVisible: true,
				networkStatus: 'SUCCESS',
				pan: action.payload.pan as string,
			};
		case 'SET_THEME':
			return {
				...state,
				theme: action.payload.theme as ITheme,
			};
		case 'HIDE_DATA':
			return {
				...state,
				cvv: '•••',
				exp: '••/••',
				pan: `•••• •••• •••• ${action.payload.lastFour}`,
				isDataVisible: false,
			};
		case 'EMIT_VISIBILITY_MESSAGE':
			messageService.emitMessage({
				type: 'apto-iframe-visibility-change',
				payload: { isVisible: state.isDataVisible },
			});
			return state;
		case 'SET_ERROR':
			return { ...state, networkStatus: 'FAILED', isDataVisible: false };
		default:
			throw new Error(`Unexpected action ${action}`);
	}
}
