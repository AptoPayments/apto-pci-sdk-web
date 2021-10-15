import themes, { IThemeName } from 'pages/app/themes';
import IApplicationState from 'types/IApplicationState';
import { IConfigOptions } from 'types/IConfigOptions';
import usePureState from './usePureState';

export default function useApplicationState(configOptions: IConfigOptions) {
	const { state, dispatch } = usePureState<IApplicationState>({
		cvv: '•••',
		exp: '••/••',
		uiStatus: 'CARD_DATA_HIDDEN',
		isLoading: false,
		message: '',
		pan: `•••• •••• •••• ${configOptions.lastFour}`,
		theme: themes[configOptions.theme as IThemeName],
		verificationId: '', // Used to get the 2FA code
		nextStep: '',
	});

	return { state, dispatch };
}
