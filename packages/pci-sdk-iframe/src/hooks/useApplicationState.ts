import themes from 'pages/app/themes';
import IApplicationState from 'types/IApplicationState';
import { IStaticState } from 'types/IStaticState';
import usePureState from './usePureState';

export default function useApplicationState(staticState: IStaticState) {
	const { state, dispatch } = usePureState<IApplicationState>({
		cvv: '•••',
		exp: '••/••',
		uiStatus: 'CARD_DATA_HIDDEN',
		isLoading: false,
		message: '',
		pan: `•••• •••• •••• ${staticState.lastFour}`,
		theme: themes[staticState.theme],
		verificationId: '', // Used to get the 2FA code
		nextStep: '',
	});

	return { state, dispatch };
}
