import IThemeName from 'types/IThemeName';

export interface IConfigOptions {
	cardId: string;
	codePlaceholderMessage: string;
	enter2FAPrompt: string;
	expiredMessage: string;
	failed2FAPrompt: string;
	isDebug: boolean;
	isPCICompliant: boolean | undefined;
	labelCvv: string;
	labelExp: string;
	labelName: string;
	labelPan: string;
	lastFour: string;
	nameOnCard: string;
	networkLogoPosition: string;
	networkLogoSymbol: string;
	pinPlaceholderMessage: string;
	pinUpdatedMessage: string;
	theme: IThemeName;
	tooManyAttemptsMessage: string;
}
