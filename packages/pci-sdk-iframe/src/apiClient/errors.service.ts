interface I401Error {
	message: string;
	code: number;
}

async function get401ResponseMessage(res: Response): Promise<string> {
	const err: I401Error = await res.json();
	switch (err.code) {
		case 90263:
			return 'Cardholder needs to verify their identity. Sending 2FA code to phone or email...';
		case 3032:
			return 'The user token you provided is invalid. Please set a valid user token: http://docs.aptopayments.com/docs/pci-sdk-web/#optionsobject-properties';
		case 3035:
			return 'The mobile API key you provided is invalid. Please set a valid API key: http://docs.aptopayments.com/docs/pci-sdk-web/#get-the-mobile-api-key';
		case 90262:
			return 'Unexpected error in cardholder verification. Please restart verification process or contact APTO if problem persists.';
		case 90000:
		default:
			/// If 90000, somehow a header property is missing. This shouldn't be possible. Information is in the message provided by API:
			return err.message;
	}
}

export default {
	get401ResponseMessage,
};
