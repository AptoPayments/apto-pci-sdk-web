import themes, { IThemeName } from 'pages/app/themes';
import IApplicationState from 'types/IApplicationState';
import { IInitialState } from 'types/IInitialState';
import usePureState from './usePureState';

export default function useApplicationState(initialState: IInitialState) {
	const { state, dispatch } = usePureState<IApplicationState>({
		cvv: '•••',
		exp: '••/••',
		uiStatus: 'CARD_DATA_HIDDEN',
		isLoading: false,
		message: '',
		pan: `•••• •••• •••• ${initialState.lastFour}`,
		theme: themes[initialState.theme as IThemeName],
		verificationId: '', // Used to get the 2FA code
		nextStep: '',
	});

	return { state, dispatch };
}
