Cypress.Commands.add('stubPrompt', stubPrompt);

function stubPrompt(response) {
	_getIframeWindow().then(win => {
		cy.stub(win, 'prompt').returns(response);
	});
}

function _getIframeWindow() {
  return cy
  .get('iframe[data-cy="pci-sdk-web"]')
  .its('0.contentWindow').should('exist')
}
