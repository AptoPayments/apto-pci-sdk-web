import { useState } from 'react';
import { IConfigOptions } from 'types/IConfigOptions';
import { INetworkLogoPosition, INetworkLogoSymbol } from 'types/INetworkLogo';
import IThemeName from 'types/IThemeName';

export default function useConfigOptions() {
	const urlParams = new URLSearchParams(window.location.search);

	const [configOptions] = useState<IConfigOptions>(() => ({
		cardId: (urlParams.get('cardId') as string) || '',
		codePlaceholderMessage: (urlParams.get('codePlaceholderMessage') as string) || 'Enter the OTP code',
		enter2FAPrompt: (urlParams.get('enter2FAPrompt') as string) || 'Enter the code we sent you (numbers only).',
		expiredMessage: (urlParams.get('expiredMessage') as string) || 'Process expired. Start again.',
		failed2FAPrompt: (urlParams.get('failed2FAPrompt') as string) || 'Wrong code. Try again.',
		isDebug: !!urlParams.get('debug'),
		// This can be true false or undefined if we don't have info
		isPCICompliant: _getIsPCICompliant(urlParams.get('isPCICompliant')),
		labelCvv: (urlParams.get('labelCvv') as string) || 'Cvv',
		labelExp: (urlParams.get('labelExp') as string) || 'Exp',
		labelName: (urlParams.get('labelName') as string) || 'Name',
		labelPan: (urlParams.get('labelPan') as string) || 'Card number',
		lastFour: (urlParams.get('lastFour') as string) || '••••',
		nameOnCard: (urlParams.get('nameOnCard') as string) || '',
		networkLogoPosition: (urlParams.get('networkLogoPosition') as INetworkLogoPosition) || 'bottom-right',
		networkLogoSymbol: (urlParams.get('networkLogoSymbol') as INetworkLogoSymbol) || '',
		networkLogoWidth: (urlParams.get('networkLogoWidth') as string) || '',
		networkLogoHeight: (urlParams.get('networkLogoHeight') as string) || '',
		pinPlaceholderMessage: (urlParams.get('pinPlaceholderMessage') as string) || 'Enter your new PIN',
		pinUpdatedMessage: (urlParams.get('pinUpdatedMessage') as string) || 'Pin successfully updated',
		theme: _getTheme(urlParams),
		tooManyAttemptsMessage: (urlParams.get('tooManyAttemptsMessage') as string) || 'Too many attempts. Start again.',
	}));

	return configOptions;
}

function _getIsPCICompliant(value: string | null): boolean | undefined {
	if (value === undefined || value === null) {
		return undefined;
	}

	return value === 'true';
}

function _getTheme(urlParams: URLSearchParams): IThemeName {
	const value = urlParams.get('theme');

	if (value === undefined || value === null) {
		return 'light';
	}

	return value as IThemeName;
}
