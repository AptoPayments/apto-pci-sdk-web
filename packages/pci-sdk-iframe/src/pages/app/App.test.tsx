import { cleanup, fireEvent, render, screen, wait } from '@testing-library/react';
import React from 'react';
import apiClient from '../../apiClient';
import { stubJSONResponse, stubMultipleJSONRespones, stubPendingResponse } from '../../fetchStub';
import App from './App';


describe('<App />', () => {
	afterEach(cleanup)

	describe('rendering card with optional property', () => {
		it('should show optional properties when provided', () => {
			stubHistory({ lastFour: '9999' });
			render(<App />);

			expect(screen.queryByText('Matias Calvo')).toBeVisible();
			expect(screen.queryByText('•••• •••• •••• 9999')).toBeVisible();
		});

		it('should show default properties when optional are not provided', () => {
			stubHistory();
			render(<App />);

			expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();
		});
	});

	describe('when user triggers the showCardData event', () => {
		beforeAll(() => {
			global.prompt = () => 'Enter the code we sent you:';
		})

		it('should make the data request when showCardData event is received', () => {
			stubHistory();
			render(<App />);

			const spy = stubPendingResponse();
			expect(spy).not.toHaveBeenCalled();

			fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));
			expect(spy).toHaveBeenCalledWith(
				expect.stringContaining('dummy_cardId/details'),
				expect.any(Object)
			)
		});

		it('should show the previous app state while the request is pending', () => {
			stubHistory();
			render(<App />);
			expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();

			const spy = stubPendingResponse();
			expect(spy).not.toHaveBeenCalled();

			fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));
			expect(spy).toHaveBeenCalled();
			expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();
		});

		it('should display the users data once the request is authenticated and response recieved', async () => {
			stubHistory();
			render(<App />);
			expect(screen.queryByText('1234 1234 1234 1234')).toBeNull();

			stubJSONResponse(dummyResponse);
			fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));
			expect(await screen.findByText('1234 1234 1234 1234')).toBeVisible();
		});

		describe('when cardId does not return data and 2FA code is requested', () => {
			afterEach(() => {
				jest.clearAllMocks();
			});

			it('should display the hidden data when 2FA request fails', async () => {
				stubHistory();
				render(<App />);

				const spy = jest.spyOn(apiClient, 'request2FACode');
				expect(spy).not.toHaveBeenCalled();

				stubMultipleJSONRespones([{ httpStatus: 400, body: {} }, { httpStatus: 400, body: {} }]);
				fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));

				await wait(() => expect(spy).toHaveBeenCalledTimes(1));
				expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();
			});

			it('should alert "Process expired. Start againg." when 2FA is expired', async () => {
				stubHistory();
				render(<App />)
				jest.spyOn(window, 'alert').mockImplementation(() => {});

				const request2FACode = jest.spyOn(apiClient, 'request2FACode');
				const verify2FACode = jest.spyOn(apiClient, 'verify2FACode');
				expect(request2FACode).not.toHaveBeenCalled();
				expect(verify2FACode).not.toHaveBeenCalled();

				stubMultipleJSONRespones([{ httpStatus: 400, body: {} }, { httpStatus: 200, body: getDummyRequest2FACodeResponse('expired') }, { httpStatus: 200, body: getDummyverify2FACodeResponse('expired') }]);
				fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));

				await wait(() => expect(request2FACode).toHaveBeenCalledTimes(1));
				await wait(() => expect(verify2FACode).toHaveBeenCalledTimes(1));
				expect(window.alert).toHaveBeenCalledWith('Process expired. Start again.')
			});
		});

		it('should alert "Too many attempts, try again." when 2FA fails', async () => {
			stubHistory();
			render(<App />)
			jest.spyOn(window, 'alert').mockImplementation(() => {});

			const request2FACode = jest.spyOn(apiClient, 'request2FACode');
			const verify2FACode = jest.spyOn(apiClient, 'verify2FACode');
			expect(request2FACode).not.toHaveBeenCalled();
			expect(verify2FACode).not.toHaveBeenCalled();

			stubMultipleJSONRespones([{ httpStatus: 400, body: {} }, { httpStatus: 200, body: getDummyRequest2FACodeResponse('failed') }, { httpStatus: 200, body: getDummyverify2FACodeResponse('failed') }]);
			fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));

			await wait(() => expect(request2FACode).toHaveBeenCalledTimes(1));
			await wait(() => expect(verify2FACode).toHaveBeenCalledTimes(1));
			expect(window.alert).toHaveBeenCalledWith('Too many attempts, try again.')
		});

		xit('should re-request the card data with a verificationId when 2FA succeeds', async () => {
			stubHistory();
			render(<App />)

			const request2FACode = jest.spyOn(apiClient, 'request2FACode');
			const verify2FACode = jest.spyOn(apiClient, 'verify2FACode');
			const getCardData = jest.spyOn(apiClient, 'getCardData');
			expect(request2FACode).not.toHaveBeenCalled();
			expect(verify2FACode).not.toHaveBeenCalled();

			stubMultipleJSONRespones([{ httpStatus: 400, body: {} }, { httpStatus: 200, body: getDummyRequest2FACodeResponse('failed') }, { httpStatus: 200, body: getDummyverify2FACodeResponse('failed') }]);
			fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));

			await wait(() => expect(request2FACode).toHaveBeenCalledTimes(1));
			await wait(() => expect(verify2FACode).toHaveBeenCalledTimes(1));
			expect(getCardData).toHaveBeenCalledWith(
				expect.stringContaining('dummy_cardId/details'),
				{
					body: expect.any(String), method: 'POST', headers: expect.any(Object)
				}
			)
		});
	});
});

const defaultParams = {
	cardId: 'dummy_cardId',
	nameOnCard: 'Matias Calvo',
}

function stubHistory(customParams: Record<string,any> = {}) {
	const url = getUrl(customParams);
	window.history.pushState({}, 'PCI SDK', url);
}

function getUrl(customParams: Record<string,any>) {
	const params = Object.assign({}, defaultParams, customParams);
	return `?${new URLSearchParams(params).toString()}`;
}

const dummyResponse = {
	'card_id': 'dummy_cardId',
	'expiration': '2023-08',
	'cvv': '123',
	'pan': '1234123412341234'
}

function getDummyRequest2FACodeResponse (status: string) {
	return {
		'verification_id': 'dummy_verification_id',
		'status': status,
		'verification_type': 'dummy_verification_type',
	};
}

function getDummyverify2FACodeResponse (status: string) {
	return {
		'verification_id': 'dummy_verification_id',
		'status': status,
	};
}
