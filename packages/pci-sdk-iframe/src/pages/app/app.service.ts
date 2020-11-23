import apiClient from '../../apiClient';
import { ICardData } from './useApp';

/**
 * Try to display PCI SDK Data.
 *
 * If the client is pci-complient the server will return the data.
 * Otherwise we need to use a verified  2FA token to get the data.
 */
async function showCardData(cardId: string): Promise<ICardData> {
	// Try to get card data from the server
	try {
		// If data is obtained just display it. We are done
		const cardData = await apiClient.getCardData(cardId);
		return cardData;
	}
	catch (err) {
		// Otherwise we request a 2FA code
		const { verificationId } = await apiClient.request2FACode();
		// If request went well we init the verify2FA code and we'll fetch card data again with this code attached
		return verify2FACode(cardId, verificationId, 'Enter the code we sent you (numbers only):');
	}
}


async function verify2FACode(cardId: string, verificationId: string, message: string): Promise<ICardData> {
	const secret = window.prompt(message);

	if (!secret) {
		throw new Error('2FA Code required');
	}

	const res = await apiClient.verify2FACode(secret, verificationId);

	return _handleVerify2FACodeResponse({ cardId, verificationId, secret, status: res.status });
}

interface handleVerify2FAResponseArgs {
	cardId: string, verificationId: string; secret: string; status: 'passed' | 'expired' | 'failed' | 'pending';
}

function _handleVerify2FACodeResponse({ status, cardId, verificationId, secret }: handleVerify2FAResponseArgs): Promise<ICardData> {
	switch (status) {
		// 2FA token is valid. We are good to get card data using the validated secret
		case 'passed':
			return apiClient.getCardData(cardId, { verificationId, secret });
		// Timeout, we need to start again
		case 'expired':
			alert('Process expired. Start again.');
			throw new Error('Process expired. Start again.');
		// Failed means too many attepmts x.x
		case 'failed':
			alert('Too many attempts, try again.');
			throw new Error('Too many attempts, try again.');
		// The code we just inserted is invalid but we can try again
		case 'pending':
			return verify2FACode(cardId, verificationId, 'Wrong code. try again:');
		default:
			throw new Error('Unknown Error');
	}
}


export default {
	showCardData,
};
