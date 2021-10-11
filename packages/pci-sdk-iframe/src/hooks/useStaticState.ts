import { IThemeName } from 'pages/app/themes';
import { useState } from 'react';
import { IStaticState } from 'types/IStaticState';

export default function useStaticState() {
	const urlParams = new URLSearchParams(window.location.search);

	const [staticState] = useState<IStaticState>(() => ({
		cardId: (urlParams.get('cardId') as string) || '',
		codePlaceholderMessage: (urlParams.get('codePlaceholderMessage') as string) || 'Enter the code',
		enter2FAPrompt: (urlParams.get('enter2FAPrompt') as string) || 'Enter the code we sent you (numbers only).',
		expiredMessage: (urlParams.get('expiredMessage') as string) || 'Process expired. Start again.',
		failed2FAPrompt: (urlParams.get('failed2FAPrompt') as string) || 'Wrong code. Try again.',
		isDebug: !!urlParams.get('debug'),
		labelCvv: (urlParams.get('labelCvv') as string) || 'Cvv',
		labelExp: (urlParams.get('labelExp') as string) || 'Exp',
		labelName: (urlParams.get('labelName') as string) || 'Name',
		labelPan: (urlParams.get('labelPan') as string) || 'Card number',
		lastFour: (urlParams.get('lastFour') as string) || '••••',
		nameOnCard: (urlParams.get('nameOnCard') as string) || '',
		pinPlaceholderMessage: (urlParams.get('pinPlaceholderMessage') as string) || 'Enter your new PIN',
		pinUpdatedMessage: (urlParams.get('pinUpdatedMessage') as string) || 'Pin successfully updated',
		theme: (urlParams.get('theme') as IThemeName) || 'light',
		tooManyAttemptsMessage: (urlParams.get('tooManyAttemptsMessage') as string) || 'Too many attempts. Start again.',
	}));

	return staticState;
}
