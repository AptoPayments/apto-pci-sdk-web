/// <reference types="Cypress" />

describe("AptoPCISdk", () => {
	let dummyAuthData;
	before(() => {
		dummyAuthData = {
			cardId: Cypress.env("CARD_ID"),
			apiKey: Cypress.env("API_KEY"),
			userToken: Cypress.env("USER_TOKEN"),
			environment: Cypress.env("ENVIRONMENT"),
		};
		cy.visit("http://localhost:8080/test.html");
	});

	beforeEach(() => {
		cy.reload();
	});

	describe("AptoPCISdk.init", () => {
		it("should render the card inside the iframe when init is called", () => {
			cy.getAptoPCISdk(async function (AptoPCISdk) {
				await AptoPCISdk.init({
					auth: dummyAuthData,
					values: { nameOnCard: "Matias Calvo" },
				});
				cy.getAptoIframe().find("#name").should("include.text", "Matias Calvo");
			});
		});

		it("should set the theme when specified", () => {
			cy.getAptoPCISdk(async function (AptoPCISdk) {
				await AptoPCISdk.init({
					auth: dummyAuthData,
					theme: "dark",
				});
				cy.getAptoIframe()
					.find("#name")
					.should("have.css", "color", "rgb(255, 255, 255)");
			});
		});

		it("should allow user to specify target element for iframe", () => {
			cy.document().then((doc) => {
				cy.getAptoPCISdk(async function (AptoPCISdk) {
					await AptoPCISdk.init({
						auth: dummyAuthData,
						element: doc.querySelector(".custom-selector"),
					});
					cy.get(".custom-selector").find("iframe").should("be.visible");
				});
			});
		});
	});

	describe("AptoPCISdk.setTheme", () => {
		it("should set text color to white if theme is dark", () => {
			cy.getAptoPCISdk(async function (AptoPCISdk) {
				await AptoPCISdk.init({
					auth: dummyAuthData,
					theme: "light",
				});
				AptoPCISdk.setTheme("dark");
				cy.wait(250).then(() => {
					cy.getAptoIframe()
						.find("#name")
						.should("have.css", "color", "rgb(255, 255, 255)");
				});
			});
		});

		it("should set text color to black if theme is light", () => {
			cy.getAptoPCISdk(async function (AptoPCISdk) {
				await AptoPCISdk.init({
					auth: dummyAuthData,
					theme: "dark",
				});
				AptoPCISdk.setTheme("light");
				cy.wait(250).then(() => {
					cy.getAptoIframe()
						.find("#name")
						.should("have.css", "color", "rgb(0, 0, 0)");
				});
			});
		});
	});

	describe("AptoPCISdk.setStyle", () => {
		it('should set the card to custom styles when "extend" keyword is not present', () => {
			cy.getAptoPCISdk(async function (AptoPCISdk) {
				await AptoPCISdk.init({
					auth: dummyAuthData,
				});
				AptoPCISdk.setStyle({
					pan: { color: "blue" },
				});
				cy.wait(250).then(() => {
					cy.getAptoIframe()
						.find("#pan")
						.should("have.css", "color", "rgb(0, 0, 255)");
					cy.getAptoIframe()
						.find("#container")
						.should("not.have.css", "display", "flex");
				});
			});
		});

		it('should extend the theme with custom styles when "extend" keyword is present', () => {
			cy.getAptoPCISdk(async function (AptoPCISdk) {
				await AptoPCISdk.init({
					auth: dummyAuthData,
					theme: "light",
				});
				AptoPCISdk.setStyle({
					extends: "dark",
					pan: { color: "blue" },
				});
				cy.wait(250).then(() => {
					cy.getAptoIframe()
						.find("#pan")
						.should("have.css", "color", "rgb(0, 0, 255)");
					cy.getAptoIframe()
						.find("#container")
						.should("have.css", "display", "flex")
						.and("have.css", "color", "rgb(255, 255, 255)");
				});
			});
		});
	});

	// xdescribe('AptoPCISdk.getVisibility', () => {
	// 	it.skip('should return false when the data is not visible', () => {
	// 		// TODO

	// 		// We might want to stub server responses to aboid 2FA logic (we assume it's unit tested at iframe-level)
	// 		// https://docs.cypress.io/guides/guides/network-requests.html#Stub-Responses

	// 		// This would be nice to avoid the extra level of indentantion due the callback.
	// 		const AptoPCISdk = await cy.getAptoPCISdk();

	// 		// Just call the sdk as usual
	// 		AptoPCISdk.init({ auth: dummyAuthData });

	// 		// By default we expect the visibility to be false
	// 		const initial = await AptoPCISdk.getIsDataVisible();
	// 		expect(initial).toBe(false);

	// 		// Try to get our pci-data
	// 		AptoPCISdk.showPCISdkData();

	// 		// https://github.com/cypress-io/cypress/issues/5316
	// 		// This might not work because the prompt is triggered by the iframe!
	// 		cy.stubPrompt(Cypress.env('2FA_CODE_CORRECT'))

	// 		// This might be very hard to do, but will be required for the tests
	// 		await waitForCardDataToBeVisible();

	// 		// Finally we expect the visibility to be true
	// 		const actual = await AptoPCISdk.getIsDataVisible();
	// 		expect(actual).toBe(true);
	// 	});
	// })
});
