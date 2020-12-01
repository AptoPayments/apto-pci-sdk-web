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
