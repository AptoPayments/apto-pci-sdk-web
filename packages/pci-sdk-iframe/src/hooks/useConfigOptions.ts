import { useState } from 'react';
import { IConfigOptions } from 'types/IConfigOptions';
import { INetworkLogoPosition, INetworkLogoSymbol } from 'types/INetworkLogo';
import IThemeName from 'types/IThemeName';

export default function useConfigOptions() {
	const urlParams = new URLSearchParams(window.location.search);

	const [configOptions] = useState<IConfigOptions>(() => ({
		card: {
			cardId: (urlParams.get('cardId') as string) || '',
			labelCvv: (urlParams.get('labelCvv') as string) || 'Cvv',
			labelExp: (urlParams.get('labelExp') as string) || 'Exp',
			labelName: (urlParams.get('labelName') as string) || 'Name',
			labelPan: (urlParams.get('labelPan') as string) || 'Card number',
			lastFour: (urlParams.get('lastFour') as string) || '••••',
			nameOnCard: (urlParams.get('nameOnCard') as string) || '',
			network: {
				logoPosition: (urlParams.get('networkLogoPosition') as INetworkLogoPosition) || 'bottom-right',
				logoSymbol: (urlParams.get('networkLogoSymbol') as INetworkLogoSymbol) || '',
				logoWidth: (urlParams.get('networkLogoWidth') as string) || '',
				logoHeight: (urlParams.get('networkLogoHeight') as string) || '',
			},
			theme: _getTheme(urlParams),
		},
		config: {
			isDebug: !!urlParams.get('debug'),
			// This can be true false or undefined if we don't have info
			isPCICompliant: _getIsPCICompliant(urlParams.get('isPCICompliant')),
		},
		labels: {
			codePlaceholder: (urlParams.get('codePlaceholderMessage') as string) || 'Enter the OTP code',
			pinPlaceholder: (urlParams.get('pinPlaceholderMessage') as string) || 'Enter your new PIN',
			otpSubmitButton: (urlParams.get('otpSubmitButton') as string) || 'Send',
			setPinSubmitButton: (urlParams.get('setPinSubmitButton') as string) || 'Update',
		},
		messages: {
			enter2FA: (urlParams.get('enter2FAPrompt') as string) || 'Enter the code we sent you (numbers only).',
			expired2FA: (urlParams.get('expiredMessage') as string) || 'Process expired. Start again.',
			failed2FA: (urlParams.get('failed2FAPrompt') as string) || 'Wrong code. Try again.',
			pinUpdated: (urlParams.get('pinUpdatedMessage') as string) || 'Pin successfully updated',
			tooManyAttempts: (urlParams.get('tooManyAttemptsMessage') as string) || 'Too many attempts. Start again.',
		},
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
