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
			global.prompt = isSecondTime => isSecondTime ? 'Wrong code. try again:' : 'Enter the code we sent you:';
		});

		beforeEach(() => {
			stubHistory();
			render(<App />);
		})

		it('should make the data request when showCardData event is received', () => {
			const spy = stubPendingResponse();
			expect(spy).not.toHaveBeenCalled();

			fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));
			expect(spy).toHaveBeenCalledWith(
				expect.stringContaining('dummy_cardId/details'),
				expect.any(Object)
			)
		});

		it('should show the previous app state while the request is pending', () => {
			expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();

			const spy = stubPendingResponse();
			expect(spy).not.toHaveBeenCalled();

			fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));
			expect(spy).toHaveBeenCalled();
			expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();
		});

		it('should display the users data once the request is authenticated and response recieved', async () => {
			expect(screen.queryByText('1234 1234 1234 1234')).toBeNull();

			stubJSONResponse(dummyGetCardDataResponse);
			fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));
			expect(await screen.findByText('1234 1234 1234 1234')).toBeVisible();
		});

		describe('when cardId does not return data and 2FA code is requested', () => {
			beforeAll(() => jest.spyOn(window, 'alert').mockImplementation(() => {}));

			afterEach(() => {
				jest.clearAllMocks();
			});

			it('should display the hidden data when 2FA request fails', async () => {
				const spy = jest.spyOn(apiClient, 'request2FACode');
				expect(spy).not.toHaveBeenCalled();

				stubMultipleJSONRespones([{ httpStatus: 400, body: {} }, { httpStatus: 400, body: {} }]);
				fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));

				await wait(() => expect(spy).toHaveBeenCalledTimes(1));
				expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();
			});

			it('should alert "Process expired. Start againg." when 2FA is expired', async () => {
				expect(window.alert).not.toHaveBeenCalled()

				stubMultipleJSONRespones([
					{ httpStatus: 400, body: {} },
					{ httpStatus: 200, body: getDummyRequest2FACodeResponse('expired') },
					{ httpStatus: 200, body: getDummyverify2FACodeResponse('expired') }
				]);

				fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));

				await wait(() => expect(window.alert).toHaveBeenCalledWith('Process expired. Start again.'))
			});

			it('should alert "Too many attempts, try again." when 2FA fails', async () => {
				expect(window.alert).not.toHaveBeenCalled()

				stubMultipleJSONRespones([
					{ httpStatus: 400, body: {} },
					{ httpStatus: 200, body: getDummyRequest2FACodeResponse('failed') },
					{ httpStatus: 200, body: getDummyverify2FACodeResponse('failed') }
				]);

				fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));

				await wait(() => expect(window.alert).toHaveBeenCalledWith('Too many attempts, try again.'));
			});

			it('should re-request the card data with a verificationId when 2FA succeeds', async () => {
				const spy = jest.spyOn(apiClient, 'getCardData');

				stubMultipleJSONRespones([
					{ httpStatus: 400, body: {} },
					{ httpStatus: 200, body: getDummyRequest2FACodeResponse('passed') },
					{ httpStatus: 200, body: getDummyverify2FACodeResponse('passed') },
					{ httpStatus: 200, body: dummyGetCardDataResponse },
				]);

				fireEvent(window, new MessageEvent('message', { data: JSON.stringify({ type: 'showCardData' }) }));

				await wait(() => expect(spy).toHaveBeenCalledWith(
					'dummy_cardId',
					{
						secret: 'Wrong code. try again:',
						verificationId: 'dummy_verification_id',
					}
				));
			});
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

const dummyGetCardDataResponse = {
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
