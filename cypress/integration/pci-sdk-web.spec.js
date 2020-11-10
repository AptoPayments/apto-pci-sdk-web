/// <reference types="Cypress" />


describe('AptoPCISdk', () => {
	let dummyAuthData;
	before(() => {
		dummyAuthData = {
			cardId: Cypress.env('CARD_ID'),
			apiKey: Cypress.env('API_KEY'),
			userToken: Cypress.env('USER_TOKEN'),
			environment: Cypress.env('ENVIRONMENT'),
		}
		cy.visit('http://localhost:8080/test.html');
	});

	beforeEach(() => {
		cy.reload();
	});

	describe('AptoPCISdk.init', () => {
		it('should render the card inside the iframe when init is called', () => {
			cy.getAptoPCISdk(async function (AptoPCISdk) {
				await AptoPCISdk.init({
					auth: dummyAuthData,
					values: { nameOnCard: 'Matias Calvo' }
				});
				cy.getAptoIframe().find('#name').should('include.text', 'Matias Calvo');
			});
		});

		it('should set the theme when specified', () => {
			cy.getAptoPCISdk(async function (AptoPCISdk) {
				await AptoPCISdk.init({
					auth: dummyAuthData,
					theme: 'dark'
				});
				cy.getAptoIframe().find('#name').should('have.css', 'color', 'rgb(255, 255, 255)');
			});
		});

		it('should allow user to specify target element for iframe', () => {
				cy.document().then(doc => {
					cy.getAptoPCISdk(async function (AptoPCISdk) {
						await AptoPCISdk.init({
							auth: dummyAuthData,
							element: doc.querySelector('.custom-selector'),
						});
						cy.get('.custom-selector').find('iframe').should('be.visible');
					});
				});
		});
	});

	describe('AptoPCISdk.setTheme', () => {
		it('should set text color to white if theme is dark', () => {
			cy.getAptoPCISdk(async function (AptoPCISdk) {
				await AptoPCISdk.init({
					auth: dummyAuthData,
					theme: 'light',
				});
				AptoPCISdk.setTheme('dark');
				cy.wait(250).then(() => {
					cy.getAptoIframe().find('#name').should('have.css', 'color', 'rgb(255, 255, 255)');
				});
			});
		});

		it('should set text color to black if theme is light', () => {
			cy.getAptoPCISdk(async function (AptoPCISdk) {
				await AptoPCISdk.init({
					auth: dummyAuthData,
					theme: 'dark',
				});
				AptoPCISdk.setTheme('light');
				cy.wait(250).then(() => {
					cy.getAptoIframe().find('#name').should('have.css', 'color', 'rgb(0, 0, 0)');
				});
			});
		});
	});

	describe('AptoPCISdk.setStyle', () => {
		it('should set the card to custom styles when "extend" keyword is not present', () => {
			cy.getAptoPCISdk(async function (AptoPCISdk) {
				await AptoPCISdk.init({
					auth: dummyAuthData,
				});
				AptoPCISdk.setStyle({
					pan: { color: 'blue' }
				});
				cy.wait(250).then(() => {
					cy.getAptoIframe().find('#pan').should('have.css', 'color', 'rgb(0, 0, 255)');
					cy.getAptoIframe().find('#container').should('not.have.css', 'display', 'flex');
				});
			});
		});

		it('should extend the theme with custom styles when "extend" keyword is present', () => {
			cy.getAptoPCISdk(async function (AptoPCISdk) {
				await AptoPCISdk.init({
					auth: dummyAuthData,
					theme: 'light',
				});
				AptoPCISdk.setStyle({
					extends: 'dark',
					pan: { color: 'blue' }
				});
				cy.wait(250).then(() => {
					cy.getAptoIframe().find('#pan').should('have.css', 'color', 'rgb(0, 0, 255)');
					cy.getAptoIframe().find('#container').should('have.css', 'display', 'flex').and('have.css', 'color', 'rgb(255, 255, 255)');
				});
			});
		});
	});
});
