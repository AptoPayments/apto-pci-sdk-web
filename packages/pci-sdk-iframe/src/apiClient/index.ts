import formatterService from '../services/formatter.service';

const urlParams = new URLSearchParams(window.location.search);
const headers = {
	'Authorization': `Bearer ${urlParams.get('userToken')}`,
	'Api-Key': `Bearer ${urlParams.get('apiKey')}`,
	'Content-Type': 'application/json',
	'Accept': 'application/json',
}


export var BASE_URL = _getBaseUrl();
export var VAULT_BASE_URL = _getVaultBaseUrl();

interface IRequest2FACodeResponse {
	verificationId: string;
	status: string;
	verificationType: string;
}

export async function request2FACode(): Promise<IRequest2FACodeResponse> {
	return fetch(`${BASE_URL}v1/verifications/primary/start`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ show_verification_secret: true }),
	})
		.then(res => res.json())
		.then(data => ({ verificationId: data.verification_id, status: data.status, verificationType: data.verification_type }));
}

interface IVerify2FACodeResponse {
	verificationId: string;
	status: 'passed' | 'pending' | 'failed' | 'expired';
}

export async function verify2FACode(secret: string, verificationId: string): Promise<IVerify2FACodeResponse> {
	return fetch(`${BASE_URL}v1/verifications/${verificationId}/finish`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ secret }),
	})
		.then(res => {
			switch (res.status) {
				case 200:
					return res.json();
				default:
					throw Error(res.status.toString());
			}
		})
		.then(res => {
			return {
				verificationId: res.verification_id,
				status: res.status,
			}
		})
}

interface IGetCardDataResponse {
	cardId: string;
	pan: string;
	exp: string;
	cvv: string;
}

export async function getCardData(cardId: string, auth?: { secret: string, verificationId: string }): Promise<IGetCardDataResponse> {
	const method = !auth ? 'GET' : 'POST';
	const body = !auth ? null : JSON.stringify({ secret: auth.secret, verification_id: auth.verificationId });

	return fetch(`${VAULT_BASE_URL}v1/user/accounts/${cardId}/details`, { method, headers, body })
		.then(res => {
			// TODO: Handle different errros better
			switch (res.status) {
				case 200:
					return res.json();
				default:
					throw Error(res.status.toString());;
			}
		})
		.then(data => ({
			cardId: data.card_id,
			exp: formatterService.formatExpirationDate(data.expiration),
			cvv: data.cvv,
			pan: formatterService.formatPan(data.pan),
		}))
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
	switch (urlParams.get('environment')?.toLowerCase()) {
		case 'sbx':
			return 'https://vault.sbx.aptopayments.com/';
		case 'stg':
			return 'https://vault.stg.aptopayments.com/';
		case 'prd':
			return 'https://vault.aptopayments.com/';
	}
}


export default {
	verify2FACode,
	getCardData,
	request2FACode,
}
