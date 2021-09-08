function parse401(errorCode: number, serverMessage: string): string {
	switch (errorCode) {
		case 90263:
			return 'Cardholder needs to verify their identity. Sending 2FA code to phone or email...';
		case 3032:
			return 'The user token you provided is invalid. Please set a valid user token: https://docs.aptopayments.com/docs/sdks/Web/pci_sdk_web/#optionsobject-properties';
		case 3035:
			return 'The mobile API key you provided is invalid. Please set a valid API key: https://docs.aptopayments.com/docs/sdks/Web/pci_sdk_web/#get-the-mobile-api-key';
		case 90262:
			return 'Unexpected error in cardholder verification. Please restart verification process or contact APTO if problem persists.';
		case 90000:
		default:
			/// If 90000, somehow a header property is missing. This shouldn't be possible. Information is in the message provided by API:
			return serverMessage;
	}
}

function parse400(customMessage?: string): string {
	return customMessage ? customMessage : 'Invalid request. Please try againg or contact APTO';
}

function parseUnknownError(): string {
	return 'An unknown error occured. Please try again or contact APTO.';
}

export default {
	parse400,
	parse401,
	parseUnknownError,
};
