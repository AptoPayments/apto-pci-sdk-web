Cypress.Commands.add("getPCISdk", getPCISdk);

function getPCISdk() {
	return cy.window().then((win) => win.AptoPCISdk);
}
