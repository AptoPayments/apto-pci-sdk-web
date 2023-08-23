import credentialsService from 'services/credentials.service';
import formatterService from '../services/formatter.service';
import errorMessageParser from './errorMessage.parser';

// We use the "userToken" to get the environment (sandbox or production)
const urlParams = new URLSearchParams(window.location.search);

export const BASE_URL = _getBaseUrl();
export const VAULT_BASE_URL = _getVaultBaseUrl();

interface IRequest2FACodeResponse {
	verificationId: string;
	status: string;
	verificationType: string;
}

export async function request2FACode(): Promise<IRequest2FACodeResponse> {
	const res = await fetch(`${BASE_URL}v1/verifications/primary/start`, {
		method: 'POST',
		headers: _getHeaders(),
		body: JSON.stringify({ show_verification_secret: true }),
	});

	const data = await res.json();

	switch (res.status) {
		case 200:
			return {
				verificationId: data.verification_id,
				status: data.status,
				verificationType: data.verification_type,
			};
		case 401:
			throw new Error(errorMessageParser.parse401(data.code, data.message));
		case 400:
			throw new Error(errorMessageParser.parse400());
		default:
			throw new Error(errorMessageParser.parseUnknownError());
	}
}

export interface IVerify2FACodeResponse {
	verificationId: string;
	status: 'passed' | 'pending' | 'failed' | 'expired';
}

export async function verify2FACode(secret: string, verificationId: string): Promise<IVerify2FACodeResponse> {
	secret = formatterService.sanitize2FACode(secret);

	const res = await fetch(`${BASE_URL}v1/verifications/${verificationId}/finish`, {
		method: 'POST',
		headers: _getHeaders(),
		body: JSON.stringify({ secret }),
	});

	const data = await res.json();

	switch (res.status) {
		case 200:
			return {
				verificationId: data.verification_id,
				status: data.status,
			};
		case 401:
			throw new Error(errorMessageParser.parse401(data.code, data.message));
		case 400:
			throw new Error(errorMessageParser.parse400());
		default:
			throw new Error(errorMessageParser.parseUnknownError());
	}
}

interface IGetCardDataResponse {
	cardId: string;
	pan: string;
	exp: string;
	cvv: string;
}

export async function getCardData(cardId: string, auth?: { verificationId: string }): Promise<IGetCardDataResponse> {
	const method = !auth ? 'GET' : 'POST';
	const body = !auth ? null : JSON.stringify({ verification_id: auth.verificationId });

	const res = await fetch(`${VAULT_BASE_URL}v1/user/accounts/${cardId}/details`, {
		method,
		headers: _getHeaders(),
		body,
	});

	const data = await res.json();

	switch (res.status) {
		case 200:
			return {
				cardId: data.card_id,
				exp: formatterService.formatExpirationDate(data.expiration),
				cvv: data.cvv,
				pan: formatterService.formatPan(data.pan),
			};
		case 401:
			throw new Error(errorMessageParser.parse401(data.code, data.message));
		case 400:
			throw new Error(errorMessageParser.parse400('Invalid cardID. Check the PCI SDK Web docs for more info.'));
		default:
			throw new Error(errorMessageParser.parseUnknownError());
	}
}

function _getBaseUrl() {
	switch (urlParams.get('environment')?.toLowerCase()) {
		case 'sbx':
			return 'https://api.sbx.aptopayments.com/';
		case 'stg':
			return 'https://api.stg.aptopayments.com/';
		case 'prd':
			return 'https://api.aptopayments.com/';
	}
}

function _getVaultBaseUrl() {
	// This should be https://vault.sbx.aptopayments.com once we finish testing the new version
	switch (urlParams.get('environment')?.toLowerCase()) {
		case 'sbx':
			return 'https://pcivault.sbx.aptopayments.com/';
		case 'stg':
			return 'https://pcivault.stg.aptopayments.com/';
		case 'prd':
			return 'https://pcivault.aptopayments.com/';
	}
}

export interface ISetPinArgs {
	pin: string;
	verificationId: string;
	cardId: string;
}

async function setPin(args: ISetPinArgs) {
	const res = await fetch(`${BASE_URL}v1/user/accounts/${args.cardId}/pci_pin`, {
		method: 'POST',
		headers: _getHeaders(),
		body: JSON.stringify({ pin: args.pin, verification_id: args.verificationId }),
	});

	const data = await res.json();

	switch (res.status) {
		case 200:
			return res;
		case 401:
			throw new Error(errorMessageParser.parse401(data.code, data.message));
		case 400:
			throw new Error(errorMessageParser.parse400('Invalid cardID. Check the PCI SDK Web docs for more info.'));
		default:
			throw new Error(errorMessageParser.parseUnknownError());
	}
}

export default {
	getCardData,
	request2FACode,
	setPin,
	verify2FACode,
};

function _getHeaders() {
	const auth = credentialsService.getAuth();
	return {
		Authorization: `Bearer ${auth.userToken}`,
		'Api-Key': `Bearer ${auth.apiKey}`,
		'Content-Type': 'application/json',
		Accept: 'application/json',
	};
}
