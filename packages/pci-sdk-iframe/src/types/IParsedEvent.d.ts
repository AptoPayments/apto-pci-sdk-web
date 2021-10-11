type IParsedEvent =
	| IHideCardDataEvent
	| IIsDataVisibleEvent
	| ISetStyleEvent
	| ISetThemeEvent
	| IShowCardDataEvent
	| IShowSetPinFormEvent
	| IUnknownEvent;

interface ISetStyleEvent {
	type: 'setStyle';
	style: IThemeName;
}
interface ISetThemeEvent {
	type: 'setTheme';
	theme: IThemeName;
}

interface IShowCardDataEvent {
	type: 'showCardData';
}

interface IHideCardDataEvent {
	type: 'hideCardData';
}

interface IIsDataVisibleEvent {
	type: 'isDataVisible';
}

interface IShowSetPinFormEvent {
	type: 'showSetPinForm';
}

interface IUnknownEvent {
	type: 'unknown';
}

export default IParsedEvent;
