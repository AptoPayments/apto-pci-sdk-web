/// <reference types='Cypress' />

describe('AptoPCISdk', () => {
	let dummyAuthData;
	before(() => {
		dummyAuthData = {
			cardId: Cypress.env('CARD_ID'),
			apiKey: Cypress.env('API_KEY'),
			userToken: Cypress.env('USER_TOKEN'),
			environment: Cypress.env('ENVIRONMENT'),
		};
		cy.visit('http://localhost:8080/test.html');
	});

	beforeEach(() => {
		cy.reload();
	});

	describe('.init', () => {
		it('should render the card inside the iframe when init is called', () => {
			cy.getPCISdk().then(async AptoPCISdk => {
				await AptoPCISdk.init({ auth: dummyAuthData, values: { nameOnCard: 'Matias Calvo' } });

				cy.getAptoIframe().find('#name').should('include.text', 'Matias Calvo');
			});
		});

		it('should set the theme when specified', () => {
			cy.getPCISdk().then(async AptoPCISdk => {
				await AptoPCISdk.init({ auth: dummyAuthData, theme: 'dark' });

				cy.getAptoIframe()
						.find('#name')
						.should('have.css', 'color', 'rgb(255, 255, 255)');
			});
		});

		it('should allow user to specify custom selector/element in which to load iframe', () => {
			cy.getPCISdk().then(async AptoPCISdk => {
				cy.document().then(async (doc) => {
					await AptoPCISdk.init({ auth: dummyAuthData, element: doc.querySelector('.custom-selector') });

					cy.get('.custom-selector').find('iframe').should('be.visible');
				});
			});
		});
	});

	describe('.setTheme', () => {
		it('should set text color to white if theme is dark', () => {
			cy.getPCISdk().then(async AptoPCISdk => {
				await AptoPCISdk.init({ auth: dummyAuthData, theme: 'light' });
				AptoPCISdk.setTheme('dark');

				cy.getAptoIframe()
					.find('#name')
					.should('have.css', 'color', 'rgb(255, 255, 255)');
			});
		});

		it('should set text color to black if theme is light', () => {
			cy.getPCISdk().then(async AptoPCISdk => {
				await AptoPCISdk.init({ auth: dummyAuthData, theme: 'dark' });
				AptoPCISdk.setTheme('light');

				cy.getAptoIframe()
					.find('#name')
					.should('have.css', 'color', 'rgb(0, 0, 0)');
			});
		});
	});

	describe('.setStyle', () => {
		it('should set the card to custom styles when "extend" keyword is not present', () => {
			cy.getPCISdk().then(async AptoPCISdk => {
				await AptoPCISdk.init({ auth: dummyAuthData });
				AptoPCISdk.setStyle({ pan: { color: 'blue' } });

				cy.getAptoIframe()
					.find('#pan')
					.should('have.css', 'color', 'rgb(0, 0, 255)');

				cy.getAptoIframe()
					.find('#container')
					.should('not.have.css', 'display', 'flex');
			});
		});

		it('should extend the theme with custom styles when "extend" keyword is present', () => {
			cy.getPCISdk().then(async AptoPCISdk => {
				await AptoPCISdk.init({ auth: dummyAuthData, theme: 'light' });
				AptoPCISdk.setStyle({ extends: 'dark', pan: { color: 'blue' } });

				cy.getAptoIframe()
					.find('#pan')
					.should('have.css', 'color', 'rgb(0, 0, 255)');

				cy.getAptoIframe()
					.find('#container')
					.should('have.css', 'display', 'flex')
					.and('have.css', 'color', 'rgb(255, 255, 255)');
			});
		});
	});

	describe('.showPCIData', () => {
		it('should display the data when showPCIData and the client is PCI compliant', () => {
			cy.getPCISdk().then(async AptoPCISdk => {
				await AptoPCISdk.init({ auth: dummyAuthData });
				cy.stubJSONResponse({ httpStatus: 200, body: dummyGetCardDataResponse });

				cy.getAptoIframe()
					.find('#pan')
					.should('not.contain', '4242 4242 4242 4242')
					.then(AptoPCISdk.showPCIData);

				cy.getAptoIframe()
					.find('#pan')
					.should('contain', '4242 4242 4242 4242')
			});
		});

		it('should display the data when showPCIData is called with an unknown cardholder id and user recieves/enters 2FA code', () => {
			cy.getPCISdk().then(async AptoPCISdk => {
				await AptoPCISdk.init({ auth: dummyAuthData });

				cy.stubWindowPromptValue('123456');
				cy.stubMultipleJSONResponses([
					{ httpStatus: 400, body: {} },
					{ httpStatus: 200, body: dummyRequest2FACodeResponse },
					{ httpStatus: 200, body: getDummyVerify2FACodeResponse('passed') },
					{ httpStatus: 200, body: dummyGetCardDataResponse },
				]);

				cy.getAptoIframe()
					.find('#pan')
					.should('not.contain', '4242 4242 4242 4242')
					.then(AptoPCISdk.showPCIData);

				cy.getAptoIframe()
					.find('#pan')
					.should('contain', '4242 4242 4242 4242')

				cy.getAptoIframe()
					.find('#exp')
					.should('contain', '08/23')

				cy.getAptoIframe()
					.find('#cvv')
					.should('contain', '123');
			});
		})
	})

	describe('.getVisibility', () => {
		it('should return false when the data is not visible', () => {
			cy.getPCISdk().then(async AptoPCISdk => {
				await AptoPCISdk.init({ auth: dummyAuthData });
				cy.stubJSONResponse({ httpStatus: 200, body: dummyGetCardDataResponse });

				// By default we expect the visibility to be false
				cy.wrap(AptoPCISdk)
					.invoke('getIsDataVisible')
					.should('eq', false)
					.then(AptoPCISdk.showPCIData);

				cy.wrap(AptoPCISdk).invoke('getIsDataVisible').should('eq', true);
			});
		});
	});
});


const dummyGetCardDataResponse = {
	card_id: 'dummy_cardId',
	expiration: '2023-08',
	cvv: '123',
	pan: '4242424242424242'
}

const dummyRequest2FACodeResponse = {
	verification_id: 'dummy_verification_id',
	status: 'dummy_status',
	verification_type: 'dummy_verification_type',
};

function getDummyVerify2FACodeResponse(status) {
	return {
		verification_id: 'dummy_verification_id',
		status: status,
	};
}
