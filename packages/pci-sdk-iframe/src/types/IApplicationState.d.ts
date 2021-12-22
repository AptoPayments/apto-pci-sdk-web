import { INetworkLogoPosition, INetworkLogoSymbol } from './INetworkLogo';
import INotificationType from './INotificationType';
import { ITheme } from './IThemes';

type IUIStatus = 'CARD_DATA_VISIBLE' | 'CARD_DATA_HIDDEN' | 'OTP_FORM' | 'SET_PIN_FORM';
type INextStep = 'VIEW_CARD_DATA' | 'SET_PIN' | '';

export default interface IApplicationState {
	cvv: string;
	exp: string;
	isLoading: boolean;
	message: string;
	notificationType: INotificationType;
	networkLogoPosition: INetworkLogoPosition;
	networkLogoSymbol: INetworkLogoSymbol;
	networkLogoWidth: string;
	networkLogoHeight: string;
	nextStep: INextStep;
	pan: string;
	theme: ITheme;
	uiStatus: IUIStatus;
	verificationId: string;
}
