type IParsedEvent =
	| IHideCardDataEvent
	| IIsDataVisibleEvent
	| ISetStyleEvent
	| ISetThemeEvent
	| IShowCardDataEvent
	| IShowSetPinFormEvent
	| IUnknownEvent
	| ISetAuthEvent;

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

/**
 * Triggered by the host library to pass the auth credentials to the iframe.
 */
interface ISetAuthEvent {
	type: 'setAuth';
	apiKey: string;
	userToken: string;
}

export default IParsedEvent;
