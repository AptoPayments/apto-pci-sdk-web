import { ModuleMocker } from 'jest-mock';

const mock = new ModuleMocker(global);

export function stubPendingResponse() {
	_resetMocks();
	return mock.spyOn(global as any, 'fetch').mockReturnValueOnce(new Promise(() => {})); // eslint-disable-line
}

export function stubJSONResponse(body: unknown, httpStatus = 200) {
	_resetMocks();
	return mock
		.spyOn(global as any, 'fetch')
		.mockResolvedValueOnce(new Response(JSON.stringify(body), { status: httpStatus }));
}

type HttpStatus = 200 | 400 | 401 | 500;

export function stubMultipleJSONResponses(responses: Array<{ httpStatus: HttpStatus; body: unknown }>) {
	_resetMocks();
	return responses.reduce((spy: any, response: { httpStatus: HttpStatus; body: unknown }) => {
		// TODO: set Spy type
		const { httpStatus, body } = response;
		return spy.mockResolvedValueOnce(new Response(JSON.stringify(body), { status: httpStatus }));
	}, mock.spyOn(global as any, 'fetch'));
}

function _resetMocks() {
	if ((global as any).fetch.mockReset) {
		(global as any).fetch.mockReset();
	}
}

export default {
	stubJSONResponse,
	stubPendingResponse,
	stubMultipleJSONResponses,
};
