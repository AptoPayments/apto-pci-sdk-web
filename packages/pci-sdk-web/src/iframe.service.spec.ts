import iframeService from './iframe.service';

describe('iframe.service', () => {
	it('should return a promise that is solved when the iframe has loaded and auth was started', async () => {
		const iframe = iframeService.initIframe({
			url: 'https://www.apto-pci-iframe.com',
			allowedCorsDomain: '*',
			authOptions: {
				apiKey: 'dummy_api_key',
				cardId: 'dummy_card_id',
				environment: 'sbx',
				userToken: 'dummy_user_token',
			},
			pciElement: document.createElement('div'),
		});

		_fireMessage('apto-iframe-ready');
		_fireMessage('apto-iframe-auth-ready');

		await expect(iframe).resolves.toBeDefined();
	});

	it('should generate an iframe with the right parameters', () => {});
});

/**
 * Emulates the parent window sending a message to the child window
 */
function _fireMessage(message: string, args?: any) {
	window.dispatchEvent(
		new MessageEvent('message', {
			data: JSON.stringify({ type: message, ...args }),
		})
	);
}
