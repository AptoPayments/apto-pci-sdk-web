import { IThemeName } from '../pages/app/themes';

export interface IStaticState {
	cardId: string;
	codePlaceholderMessage: string;
	enter2FAPrompt: string;
	expiredMessage: string;
	failed2FAPrompt: string;
	isDebug: boolean;
	labelCvv: string;
	labelExp: string;
	labelName: string;
	labelPan: string;
	lastFour: string;
	nameOnCard: string;
	pinPlaceholderMessage: string;
	pinUpdatedMessage: string;
	theme: IThemeName;
	tooManyAttemptsMessage: string;
}
