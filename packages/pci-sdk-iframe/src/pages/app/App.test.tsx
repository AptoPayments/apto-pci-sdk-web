import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { stubJSONResponse, stubMultipleJSONResponses, stubPendingResponse } from '../../fetchStub';
import App from './App';

describe('<App />', () => {
	beforeAll(() => {
		global.prompt = jest.fn().mockImplementation((isFirstAttempt) => (isFirstAttempt ? '123456' : '654321'));
	});

	afterEach(jest.clearAllMocks);

	describe('when rendering card with custom text properties', () => {
		it('should show custom lastFour when provided', () => {
			addUrlParams({ lastFour: '9999' });
			render(<App />);

			expect(screen.queryByText('•••• •••• •••• 9999')).toBeVisible();
		});

		it('should show default lastFour when not provided', () => {
			addUrlParams();
			render(<App />);

			expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();
		});

		it('should show custom cardholder name when provided', () => {
			addUrlParams({ nameOnCard: 'Matias Calvo' });
			render(<App />);

			expect(screen.queryByTestId('cardholder-name')).not.toBeEmptyDOMElement();
			expect(screen.queryByText('Matias Calvo')).toBeVisible();
		});

		it('should show default cardholder name when property not provided', () => {
			addUrlParams();
			render(<App />);

			expect(screen.queryByTestId('cardholder-name')).toBeEmptyDOMElement();
		});

		it('should show custom labelCvv when provided', () => {
			addUrlParams({ labelCvv: 'custom_cvv' });
			render(<App />);

			expect(screen.queryByText('custom_cvv')).toBeVisible();
		});

		it('should show default labelCvv when property not provided', () => {
			addUrlParams();
			render(<App />);

			expect(screen.queryByText('Cvv')).toBeVisible();
		});

		it('should show custom labelExp when provided', () => {
			addUrlParams({ labelExp: 'custom_exp' });
			render(<App />);

			expect(screen.queryByText('custom_exp')).toBeVisible();
		});

		it('should show default labelExp when property not provided', () => {
			addUrlParams();
			render(<App />);

			expect(screen.queryByText('Exp')).toBeVisible();
		});

		describe('when optional properties, hidden by default, are provided', () => {
			it('should show custom labelName when provided', async () => {
				addUrlParams({ labelName: 'custom_labelName' });
				render(<App />);

				expect(screen.queryByText('custom_labelName')).not.toBeVisible();

				_fireMessage('setStyle', { style: { labels: { display: 'block' } } });

				expect(await screen.findByText('custom_labelName')).toBeVisible();
			});

			it('should show default labelName when property not provided', async () => {
				addUrlParams();
				render(<App />);

				expect(screen.queryByText('Name')).not.toBeVisible();

				_fireMessage('setStyle', { style: { labels: { display: 'block' } } });

				expect(await screen.findByText('Name')).toBeVisible();
			});

			it('should show custom labelPan when provided', async () => {
				addUrlParams({ labelPan: 'custom_labelPan' });
				render(<App />);

				expect(screen.queryByText('custom_labelPan')).not.toBeVisible();

				_fireMessage('setStyle', { style: { labels: { display: 'block' } } });

				expect(await screen.findByText('custom_labelPan')).toBeVisible();
			});

			it('should show default labelPan when property not provided', async () => {
				addUrlParams();
				render(<App />);

				expect(screen.queryByText('Card number')).not.toBeVisible();

				_fireMessage('setStyle', { style: { labels: { display: 'block' } } });

				expect(await screen.findByText('Card number')).toBeVisible();
			});

			it('should show custom text for the 2FA submit button when provided', async () => {
				addUrlParams({ otpSubmitButton: 'custom_otpSubmitButton' });

				render(<App />);

				stubMultipleJSONResponses([
					{ httpStatus: 401, body: { code: 90263 } },
					{ httpStatus: 200, body: dummyRequest2FACodeResponse },
					{ httpStatus: 200, body: getDummyVerify2FACodeResponse('expired') },
				]);

				_fireMessage('showCardData');

				await waitFor(() => {
					expect(screen.queryByTestId('otp-form')).toBeVisible();
				});

				await waitFor(() => expect(screen.queryByText('custom_otpSubmitButton')).toBeVisible());
			});

			it('should show custom expiredMessage for 2FA when provided', async () => {
				addUrlParams({ expiredMessage: 'custom_expiredMessage' });

				render(<App />);

				stubMultipleJSONResponses([
					{ httpStatus: 401, body: { code: 90263 } },
					{ httpStatus: 200, body: dummyRequest2FACodeResponse },
					{ httpStatus: 200, body: getDummyVerify2FACodeResponse('expired') },
				]);

				_fireMessage('showCardData');

				await waitFor(() => {
					expect(screen.queryByTestId('otp-form')).toBeVisible();
				});

				userEvent.click(screen.getByRole('button'));

				await waitFor(() => expect(screen.queryByText('custom_expiredMessage')).toBeVisible());
			});

			it('should show custom tooManyAttemptsMessage for 2FA when provided', async () => {
				addUrlParams({
					tooManyAttemptsMessage: 'custom_tooManyAttemptsMessage',
				});

				render(<App />);

				stubMultipleJSONResponses([
					{ httpStatus: 401, body: { code: 90263 } },
					{ httpStatus: 200, body: dummyRequest2FACodeResponse },
					{ httpStatus: 200, body: getDummyVerify2FACodeResponse('failed') },
				]);

				_fireMessage('showCardData');

				await waitFor(() => {
					expect(screen.queryByTestId('otp-form')).toBeVisible();
				});

				userEvent.click(screen.getByRole('button'));

				await waitFor(() => expect(screen.queryByText('custom_tooManyAttemptsMessage')).toBeVisible());
			});
		});
	});

	describe('when user triggers the showCardData event', () => {
		beforeEach(() => {
			addUrlParams();
			render(<App />);
		});

		it('should make the data request to getCardData when showCardData event is received', () => {
			const spy = stubPendingResponse();
			expect(spy).not.toHaveBeenCalled();

			_fireMessage('showCardData');

			expect(spy).toHaveBeenNthCalledWith(1, expect.stringContaining('dummy_cardId/details'), {
				body: null,
				headers: {
					Accept: 'application/json',
					'Api-Key': 'Bearer null',
					Authorization: 'Bearer null',
					'Content-Type': 'application/json',
				},
				method: 'GET',
			});
		});

		it('should show the previous app state while the getCardData request is pending', () => {
			expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();

			const spy = stubPendingResponse();
			expect(spy).not.toHaveBeenCalled();

			_fireMessage('showCardData');

			expect(spy).toHaveBeenCalled();
			expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();
		});

		it('should display the users data when getCardData is successful and response received', async () => {
			expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();

			stubJSONResponse(dummy_get_card_data_successful_response);
			_fireMessage('showCardData');

			expect(await screen.findByText('1234 1234 1234 1234')).toBeVisible();
			expect(await screen.findByText('08/23')).toBeVisible();
			expect(await screen.findByText('123')).toBeVisible();

			expect(await screen.queryByText('•••• •••• •••• ••••')).toBeNull();
		});

		it('should only make one request when getCardData is successful', async () => {
			const spy = jest.spyOn(global, 'fetch');

			stubJSONResponse(dummy_get_card_data_successful_response);
			_fireMessage('showCardData');

			await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
			expect(spy).not.toHaveBeenCalledTimes(2);
		});

		describe('when getCardData does not return data and 2FA code is requested', () => {
			it('should request a new 2FA code if authentication fails', async () => {
				const fetchSpy = jest.spyOn(global, 'fetch');

				stubMultipleJSONResponses([
					{ httpStatus: 401, body: { code: 90263 } },
					{ httpStatus: 200, body: {} },
				]);

				_fireMessage('showCardData');

				await waitFor(() => {
					const [secondCallPath, secondCallPayload] = fetchSpy.mock.calls[1];

					// after failing to fetch the card details it should have attempted to
					// start the 2FA verification by sending a code to the user's phone
					expect(secondCallPath).toContain('verifications/primary/start');
					expect(secondCallPayload).toStrictEqual({
						body: JSON.stringify({ show_verification_secret: true }),
						headers: {
							Accept: 'application/json',
							'Api-Key': 'Bearer null',
							Authorization: 'Bearer null',
							'Content-Type': 'application/json',
						},
						method: 'POST',
					});
				});
			});

			it('should have called fetch only twice and still show hidden data if request2FACode fails', async () => {
				const spy = jest.spyOn(global, 'fetch');

				stubMultipleJSONResponses([
					{ httpStatus: 401, body: { code: 90263 } },
					{ httpStatus: 500, body: {} },
				]);

				_fireMessage('showCardData');

				await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));

				expect(spy).not.toHaveBeenCalledTimes(3);
				expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();
			});

			describe('when request2FACode succeeds and the user attempts to verify their code', () => {
				it('should request to verify the new 2FA code after user enters it', async () => {
					const spy = jest.spyOn(global, 'fetch');

					stubMultipleJSONResponses([
						{ httpStatus: 401, body: { code: 90263 } },
						{ httpStatus: 200, body: dummyRequest2FACodeResponse },
						{ httpStatus: 200, body: getDummyVerify2FACodeResponse('expired') },
					]);

					_fireMessage('showCardData');

					await waitFor(() => {
						expect(screen.queryByTestId('otp-form')).toBeVisible();
						expect(screen.queryByText('Unexpected error')).toBeNull();
					});

					userEvent.type(screen.getByLabelText('Enter the OTP code'), '123456');
					userEvent.click(screen.getByRole('button'));

					return waitFor(() =>
						expect(spy).toHaveBeenNthCalledWith(
							3,
							expect.stringContaining('verifications/dummy_verification_id/finish'),
							{
								body: JSON.stringify({ secret: '123456' }),
								headers: {
									Accept: 'application/json',
									'Api-Key': 'Bearer null',
									Authorization: 'Bearer null',
									'Content-Type': 'application/json',
								},
								method: 'POST',
							}
						)
					);
				});

				it('should fail to show the data after three calls to fetch if verification fails', async () => {
					const spy = jest.spyOn(global, 'fetch');

					stubMultipleJSONResponses([
						{ httpStatus: 401, body: { code: 90263 } },
						{ httpStatus: 200, body: dummyRequest2FACodeResponse },
						{ httpStatus: 400, body: {} },
					]);

					_fireMessage('showCardData');

					await waitFor(() => {
						expect(screen.queryByTestId('otp-form')).toBeVisible();
					});

					userEvent.type(screen.getByLabelText('Enter the OTP code'), '000000');
					userEvent.click(screen.getByRole('button'));

					await waitFor(() => expect(spy).toHaveBeenCalledTimes(3));
					expect(spy).not.toHaveBeenCalledTimes(4);
					expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();
				});

				it('should display "Process expired. Start again." when 2FA is expired', async () => {
					expect(screen.queryByText('Process expired. Start again.')).toBeNull();

					stubMultipleJSONResponses([
						{ httpStatus: 401, body: { code: 90263 } },
						{ httpStatus: 200, body: dummyRequest2FACodeResponse },
						{ httpStatus: 200, body: getDummyVerify2FACodeResponse('expired') },
					]);

					_fireMessage('showCardData');

					await waitFor(() => {
						expect(screen.queryByTestId('otp-form')).toBeVisible();
					});

					userEvent.type(screen.getByLabelText('Enter the OTP code'), '000000');
					userEvent.click(screen.getByRole('button'));

					await waitFor(() => {
						expect(screen.queryByText('Process expired. Start again.')).toBeVisible();
						expect(screen.queryByTestId('otp-form')).toBeNull();
					});
				});

				it('should display "Too many attempts. Start again." when 2FA fails', async () => {
					expect(screen.queryByText('Too many attempts, try again.')).toBeNull();

					stubMultipleJSONResponses([
						{ httpStatus: 401, body: { code: 90263 } },
						{ httpStatus: 200, body: dummyRequest2FACodeResponse },
						{ httpStatus: 200, body: getDummyVerify2FACodeResponse('failed') },
					]);

					_fireMessage('showCardData');

					await waitFor(() => {
						expect(screen.queryByTestId('otp-form')).toBeVisible();
					});

					userEvent.type(screen.getByLabelText('Enter the OTP code'), '000000');
					userEvent.click(screen.getByRole('button'));

					await waitFor(() => {
						expect(screen.queryByText('Too many attempts. Start again.')).toBeVisible();
						expect(screen.queryByTestId('otp-form')).toBeNull();
					});
				});

				it('should display "Wrong code. Try again." when 2FA fails but can retry', async () => {
					stubMultipleJSONResponses([
						{ httpStatus: 401, body: { code: 90263 } },
						{ httpStatus: 200, body: dummyRequest2FACodeResponse },
						{ httpStatus: 200, body: getDummyVerify2FACodeResponse('pending') },
					]);

					_fireMessage('showCardData');

					await waitFor(() => {
						expect(screen.queryByTestId('otp-form')).toBeVisible();
					});

					userEvent.type(screen.getByLabelText('Enter the OTP code'), '000000');
					userEvent.click(screen.getByRole('button'));

					await waitFor(() => {
						expect(screen.queryByText('Wrong code. Try again.')).toBeVisible();
						expect(screen.queryByTestId('otp-form')).toBeVisible();
					});
				});

				describe('when verify2FA succeeds and we call getCardData again', () => {
					it('should re-request the card data with a verificationId when 2FA succeeds', async () => {
						const spy = jest.spyOn(global, 'fetch');

						stubMultipleJSONResponses([
							{ httpStatus: 401, body: { code: 90263 } },
							{ httpStatus: 200, body: dummyRequest2FACodeResponse },
							{
								httpStatus: 200,
								body: getDummyVerify2FACodeResponse('passed'),
							},
							{ httpStatus: 200, body: dummy_get_card_data_successful_response },
						]);

						_fireMessage('showCardData');

						await waitFor(() => {
							expect(screen.queryByTestId('otp-form')).toBeVisible();
						});

						userEvent.type(screen.getByLabelText('Enter the OTP code'), '123456');
						userEvent.click(screen.getByRole('button'));

						await waitFor(() =>
							expect(spy).toHaveBeenNthCalledWith(4, expect.stringContaining('dummy_cardId/details'), {
								body: JSON.stringify({ verification_id: 'dummy_verification_id' }),
								headers: {
									Accept: 'application/json',
									'Api-Key': 'Bearer null',
									Authorization: 'Bearer null',
									'Content-Type': 'application/json',
								},
								method: 'POST',
							})
						);
					});

					it('should show the card data when 2nd attempt at getCardData succeeds', async () => {
						expect(screen.queryByText('•••• •••• •••• ••••')).toBeVisible();

						stubMultipleJSONResponses([
							{ httpStatus: 401, body: { code: 90263 } },
							{ httpStatus: 200, body: dummyRequest2FACodeResponse },
							{
								httpStatus: 200,
								body: getDummyVerify2FACodeResponse('passed'),
							},
							{ httpStatus: 200, body: dummy_get_card_data_successful_response },
						]);

						_fireMessage('showCardData');

						await waitFor(() => {
							expect(screen.queryByTestId('otp-form')).toBeVisible();
						});

						userEvent.type(screen.getByLabelText('Enter the OTP code'), '123456');
						userEvent.click(screen.getByRole('button'));

						return waitFor(() => {
							expect(screen.queryByText('1234 1234 1234 1234')).toBeVisible();
							expect(screen.queryByText('•••• •••• •••• ••••')).toBeNull();
							expect(screen.queryByText('123', { selector: '#cvv' })).toBeVisible();
							expect(screen.queryByText('08/23', { selector: '#exp' })).toBeVisible();
						});
					});
				});
			});
		});
	});

	describe('when user triggers the hideCardData event', () => {
		it('should hide the user data when the user requests it', async () => {
			addUrlParams({ lastFour: '1234' });
			render(<App />);

			stubJSONResponse(dummy_get_card_data_successful_response);
			_fireMessage('showCardData');

			expect(await screen.findByText('1234 1234 1234 1234')).toBeVisible();
			expect(await screen.queryByText('•••• •••• •••• 1234')).toBeNull();

			_fireMessage('hideCardData');
			expect(await screen.queryByText('1234 1234 1234 1234')).toBeNull();
			expect(await screen.findByText('•••• •••• •••• 1234')).toBeVisible();
		});
	});

	describe('when user triggers the setStyle event', () => {
		it('should turn the label text blue when custom css is passed', () => {
			addUrlParams();
			render(<App />);

			_fireMessage('setStyle', { style: { labels: { color: 'blue' } } });

			expect(screen.queryByText('Card number')).toHaveStyle('color: blue');
		});
	});

	describe('when user triggers the setTheme event', () => {
		it('should turn the theme from default to "dark" when set in setTheme', () => {
			addUrlParams({ nameOnCard: 'Matias Calvo' });

			render(<App />);

			expect(screen.getByTestId('card-container')).toHaveStyle('color: black');

			_fireMessage('setTheme', { theme: 'dark' });

			expect(screen.getByTestId('card-container')).toHaveStyle('color: white');
		});
	});

	describe('when the user triggers the "showSetPinForm" event', () => {
		it('should start the verification process to get a valid verification id', () => {
			stubJSONResponse(dummyRequest2FACodeResponse, 200);

			render(<App />);

			_fireMessage('showSetPinForm');

			return waitFor(() => {
				expect(screen.queryByTestId('otp-form')).toBeVisible();
			});
		});

		it('should display the set pin form once the 2FA passes', async () => {
			stubMultipleJSONResponses([
				// Mock the 2FA code request
				{ httpStatus: 200, body: dummyRequest2FACodeResponse },
				// Pass the the 2FA validation
				{
					httpStatus: 200,
					body: getDummyVerify2FACodeResponse('passed'),
				},
				// Pin is successfully updated
				{
					httpStatus: 200,
					body: {},
				},
			]);

			render(<App />);

			_fireMessage('showSetPinForm');

			await waitFor(() => {
				expect(screen.queryByTestId('otp-form')).toBeVisible();
			});

			// Fill the 2FA with a valid code
			userEvent.type(screen.getByLabelText('Enter the OTP code'), '123456');
			userEvent.click(screen.getByRole('button'));

			return waitFor(() => {
				expect(screen.queryByTestId('set-pin-form')).toBeVisible();
			});
		});

		it('should send the new pin to the server', async () => {
			const fetchSpy = jest.spyOn(global, 'fetch');

			stubMultipleJSONResponses([
				// Mock the 2FA code request
				{ httpStatus: 200, body: dummyRequest2FACodeResponse },
				// Pass the the 2FA validation
				{
					httpStatus: 200,
					body: getDummyVerify2FACodeResponse('passed'),
				},
				// Pin is successfully updated
				{
					httpStatus: 200,
					body: {},
				},
			]);

			render(<App />);

			_fireMessage('showSetPinForm');

			await waitFor(() => {
				expect(screen.queryByTestId('otp-form')).toBeVisible();
			});

			// Fill the 2FA with a valid code
			userEvent.type(screen.getByLabelText('Enter the OTP code'), '123456');
			userEvent.click(screen.getByRole('button'));

			await waitFor(() => {
				expect(screen.queryByTestId('set-pin-form')).toBeVisible();
			});

			// Set a new PIN
			userEvent.type(screen.getByPlaceholderText('Enter your new PIN'), '0000');
			userEvent.click(screen.getByRole('button'));

			await waitFor(() => {
				expect(fetchSpy).toHaveBeenLastCalledWith(expect.stringContaining('/pci_pin'), {
					body: JSON.stringify({ pin: '0000', verification_id: 'dummy_verification_id' }),
					headers: {
						Accept: 'application/json',
						'Api-Key': 'Bearer null',
						Authorization: 'Bearer null',
						'Content-Type': 'application/json',
					},
					method: 'POST',
				});
			});

			expect(screen.queryByText('Pin successfully updated')).toBeVisible();
		});

		it('should display an error message when the update pin request fails', async () => {
			const fetchSpy = jest.spyOn(global, 'fetch');

			stubMultipleJSONResponses([
				// Mock the 2FA code request
				{ httpStatus: 200, body: dummyRequest2FACodeResponse },
				// Pass the the 2FA validation
				{
					httpStatus: 200,
					body: getDummyVerify2FACodeResponse('passed'),
				},
				// Pin is successfully updated
				{
					httpStatus: 500,
					body: {},
				},
			]);

			render(<App />);

			_fireMessage('showSetPinForm');

			await waitFor(() => {
				expect(screen.queryByTestId('otp-form')).toBeVisible();
			});

			// Fill the 2FA with a valid code
			userEvent.type(screen.getByLabelText('Enter the OTP code'), '123456');
			userEvent.click(screen.getByRole('button'));

			await waitFor(() => {
				expect(screen.queryByTestId('set-pin-form')).toBeVisible();
			});

			// Set a new PIN
			userEvent.type(screen.getByPlaceholderText('Enter your new PIN'), '0000');
			userEvent.click(screen.getByRole('button'));

			await waitFor(() => {
				expect(fetchSpy).toHaveBeenLastCalledWith(expect.stringContaining('/pci_pin'), {
					body: JSON.stringify({ pin: '0000', verification_id: 'dummy_verification_id' }),
					headers: {
						Accept: 'application/json',
						'Api-Key': 'Bearer null',
						Authorization: 'Bearer null',
						'Content-Type': 'application/json',
					},
					method: 'POST',
				});
			});

			expect(screen.queryByText('Unexpected error. Contact support.')).toBeVisible();
		});
	});
});

/**
 * Emulates the parent window sending a message to the child window
 */
function _fireMessage(message: string, args?: any) {
	fireEvent(
		window,
		new MessageEvent('message', {
			data: JSON.stringify({ type: message, ...args }),
		})
	);
}

const defaultParams = {
	cardId: 'dummy_cardId',
};

function addUrlParams(customParams: Record<string, any> = {}) {
	const url = getUrl(customParams);
	window.history.pushState({}, 'PCI SDK', url);
}

function getUrl(customParams: Record<string, any>) {
	const params = Object.assign({}, defaultParams, customParams);
	return `?${new URLSearchParams(params).toString()}`;
}

const dummy_get_card_data_successful_response = {
	card_id: 'dummy_cardId',
	expiration: '2023-08',
	cvv: '123',
	pan: '1234123412341234',
};

const dummyRequest2FACodeResponse = {
	verification_id: 'dummy_verification_id',
	status: 'dummy_status',
	verification_type: 'dummy_verification_type',
};

function getDummyVerify2FACodeResponse(status: string) {
	return {
		verification_id: 'dummy_verification_id',
		status: status,
	};
}
