import themes from 'pages/app/themes';
import IApplicationState from 'types/IApplicationState';
import { IConfigOptions } from 'types/IConfigOptions';
import usePureState from './usePureState';

export default function useApplicationState(configOptions: IConfigOptions) {
	const { state, dispatch } = usePureState<IApplicationState>({
		cvv: '•••',
		exp: '••/••',
		isLoading: false,
		message: '',
		networkLogoPosition: configOptions.networkLogoPosition,
		networkLogoSymbol: configOptions.networkLogoSymbol,
		nextStep: '',
		pan: `•••• •••• •••• ${configOptions.lastFour}`,
		theme: themes[configOptions.theme],
		uiStatus: 'CARD_DATA_HIDDEN',
		verificationId: '', // Used to get the 2FA code
	});

	return { state, dispatch };
}
