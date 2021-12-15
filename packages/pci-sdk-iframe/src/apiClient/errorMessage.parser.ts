function parse401(errorCode: number, serverMessage: string): string {
	switch (errorCode) {
		case 90263:
			return 'Cardholder needs to verify their identity. Sending 2FA code to phone or email...';
		case 3032:
			return 'Invalid user token. Contact support.';
		case 3035:
			return 'Invalid Mobile API key. Contact support.';
		case 90262:
			return 'Unexpected error in cardholder verification. Contact support.';
		case 90000:
		default:
			/// If 90000, somehow a header property is missing. This shouldn't be possible. Information is in the message provided by API:
			return serverMessage;
	}
}

function parse400(customMessage?: string): string {
	return customMessage ? customMessage : 'Invalid request. Contact support.';
}

function parseUnknownError(): string {
	return 'Unexpected error. Contact support.';
}

export default {
	parse400,
	parse401,
	parseUnknownError,
};
