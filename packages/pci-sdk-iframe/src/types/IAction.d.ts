import ICardData from 'types/';
import { ITheme } from './IThemes';

type IAction =
	| IActionEmitVisibilityMessage
	| IActionHideData
	| IActionSetCardData
	| IActionSetError
	| IActionSetLoading
	| IActionSetTheme;

interface IActionSetLoading {
	type: 'SET_LOADING';
}

interface IActionEmitVisibilityMessage {
	type: 'EMIT_VISIBILITY_MESSAGE';
}

interface IActionSetError {
	type: 'SET_ERROR';
}

interface IActionSetCardData {
	type: 'SET_CARD_DATA';
	payload: ICardData;
}

interface IActionSetTheme {
	type: 'SET_THEME';
	payload: {
		theme: ITheme;
	};
}

interface IActionHideData {
	type: 'HIDE_DATA';
	payload: {
		lastFour: string;
	};
}

export default IAction;
