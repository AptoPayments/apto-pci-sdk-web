import IThemeName from 'types/IThemeName';
import { INetworkLogoPosition, INetworkLogoSymbol } from './INetworkLogo';

export interface IConfigOptions {
	card: {
		cardId: string;
		labelCvv: string;
		labelExp: string;
		labelName: string;
		labelPan: string;
		lastFour: string;
		nameOnCard: string;
		network: {
			logoPosition: INetworkLogoPosition;
			logoSymbol: INetworkLogoSymbol;
			logoWidth: string;
			logoHeight: string;
		};
		theme: IThemeName;
	};
	config: {
		isDebug: boolean;
		isPCICompliant: boolean | undefined;
	};
	labels: {
		codePlaceholder: string;
		pinPlaceholder: string;
		otpSubmitButton: string;
		setPinSubmitButton: string;
	};
	messages: {
		enter2FA: string;
		expired2FA: string;
		failed2FA: string;
		tooManyAttempts: string;
		pinUpdated: string;
	};
}
