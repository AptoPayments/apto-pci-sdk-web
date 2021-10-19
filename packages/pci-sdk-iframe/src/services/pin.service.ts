import apiClient from 'apiClient';
import IStateFn from 'types/IStateFn';

interface IShowSetPinFormArgs {
	dispatch: IStateFn;
}

async function showSetPinForm({ dispatch }: IShowSetPinFormArgs) {
	const { verificationId } = await apiClient.request2FACode();
	return dispatch({ verificationId, uiStatus: 'OTP_FORM', nextStep: 'SET_PIN', message: '' });
}

interface ISetPinArgs {
	cardId: string;
	pin: string;
	// TODO: Make this optional since when the client is PCI-Compatible we don't need a verificationId)
	verificationId: string;
}

function setPin(args: ISetPinArgs) {
	return apiClient.setPin({ pin: args.pin, verificationId: args.verificationId, cardId: args.cardId });
}

export default {
	setPin,
	showSetPinForm,
};
