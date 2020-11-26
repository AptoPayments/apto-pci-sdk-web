/************************************************
 * For more on custom commands:
 * https://on.cypress.io/custom-commands
 ************************************************/

Cypress.Commands.add('getAptoIframe', getAptoIframe);

function getAptoIframe() {
	// get the document
	return _getIframeDocument()
			// automatically retries until body is loaded
			.its('body')
			.should('not.be.undefined')
			// wraps 'body' DOM element to allow
			// chaining more Cypress commands, like '.find(...)'
			.then(cy.wrap);
}

function _getIframeDocument() {
	return (
		cy
			.get('iframe[data-cy="pci-sdk-web"]')
			// Cypress yields jQuery element, which has the real
			// DOM element under property '0'.
			// From the real DOM iframe element we can get
			// the 'document' element, it is stored in 'contentDocument' property
			// Cypress 'its' command can access deep properties using dot notation
			// https://on.cypress.io/its
			.its('0.contentDocument')
			.should('exist')
	);
}

Cypress.Commands.add('getAptoPCISdk', getAptoPCISdk);

function getAptoPCISdk(callback) {
	return cy.window().then(async (win) => {
		const scopedCallback = callback.bind(this); // This gives us access to fixture data and other stored values via 'this'
		return scopedCallback(win.AptoPCISdk);
	});
}

Cypress.Commands.add('waitForElement', waitForElement);

const POLL_INTERVAL = 200;
const MAX_POLL_ATTEMPTS = 300;

function waitForElement(selector) {
	return new Cypress.Promise((resolve, reject) => {
		let index = 0;

		const pollForElement = setInterval(() => {
			const domHasElement = _checkIfElementExists(selector);

			if (domHasElement) {
				clearInterval(pollForElement);
				resolve();
			}

			if (index > MAX_POLL_ATTEMPTS) {
				reject();
			}

			index += 1;
		}, POLL_INTERVAL)
	});
}

function _checkIfElementExists(selector) {
	return Cypress.$(selector).length > 0;
}
