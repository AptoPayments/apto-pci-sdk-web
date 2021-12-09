import { IThemeName } from '../pages/app/themes';

export interface IStaticState {
	card: {
		cardId: string;
		labelCvv: string;
		labelExp: string;
		labelName: string;
		labelPan: string;
		lastFour: string;
		nameOnCard: string;
		theme: IThemeName;
	};
	config: {
		isDebug: boolean;
		isPCICompliant: boolean | undefined;
	};
	labels: {
		codePlaceholder: string;
		pinPlaceholder: string;
	};
	messages: {
		enter2FA: string;
		expired2FA: string;
		failed2FA: string;
		tooManyAttempts: string;
		pinUpdated: string;
	};
}
