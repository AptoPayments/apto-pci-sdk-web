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
		notificationType: 'positive',
		networkLogoPosition: configOptions.card.network.logoPosition,
		networkLogoSymbol: configOptions.card.network.logoSymbol,
		networkLogoWidth: configOptions.card.network.logoWidth,
		networkLogoHeight: configOptions.card.network.logoHeight,
		nextStep: '',
		pan: `•••• •••• •••• ${configOptions.card.lastFour}`,
		theme: themes[configOptions.card.theme],
		uiStatus: 'CARD_DATA_HIDDEN',
		verificationId: '', // Used to get the 2FA code
	});

	return { state, dispatch };
}
