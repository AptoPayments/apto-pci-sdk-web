Cypress.Commands.add('stubJSONResponse', stubJSONResponse);

function stubJSONResponse(options) {
	const { httpStatus, body } = options;
	cy.intercept('*', {
		statusCode: httpStatus,
		body: JSON.stringify(body),
	});
}

Cypress.Commands.add('stubMultipleJSONResponses', stubMultipleJSONResponses);

function stubMultipleJSONResponses(optsArray) {
	let requestIndex = 0;
	cy.intercept('*', req => {
		const options = optsArray[requestIndex] ? optsArray[requestIndex] : { httpStatus: 400, body: {} };
		const { httpStatus, body } = options;
		req.reply({
			statusCode: httpStatus,
			body: JSON.stringify(body),
		})
		requestIndex += 1;
	});
}
