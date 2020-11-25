export default interface IState {
	networkStatus: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED';
	theme: ITheme;
	isDataVisible: boolean;
	cvv: string;
	exp: string;
	pan: string;
}
