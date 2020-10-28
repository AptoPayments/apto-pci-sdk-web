import formatterService from './formatter.service';

describe('formatterService', () => {
	describe('formatExpirationDate', () => {
		it('should return an empty string when value is empty', () => {
			const actual = formatterService.formatExpirationDate('');
			expect(actual).toBe('');
		});

		it('should format the expiration date as mm/yy when the given format is mmyy', () => {
			const actual = formatterService.formatExpirationDate('0823');
			expect(actual).toBe('08/23');
		});

		it('should format the expiration date as mm/yy when the given format is yyyy-mm', () => {
			const actual = formatterService.formatExpirationDate('2023-08');
			expect(actual).toBe('08/23');
		});

		it('should format the expiration date as mm/yy when the given format is mm-yyyy', () => {
			const actual = formatterService.formatExpirationDate('08-2023');
			expect(actual).toBe('08/23');
		});

		it('should format the expiration date as mm/yy when the given format is mm-yy', () => {
			const actual = formatterService.formatExpirationDate('08-23');
			expect(actual).toBe('08/23');
		});
	});

	describe('formatPan', () => {
		it('should return an empty string when value is empty', () => {
			const actual = formatterService.formatPan('');
			expect(actual).toBe('');
		});

		it('should format pan in 4 number groups', () => {
			const actual = formatterService.formatPan('4242424242424242');
			expect(actual).toBe('4242 4242 4242 4242');
		});

		it('should remove any character other than numbers', () => {
			const actual = formatterService.formatPan('US42 4242 4242 4242 42&');
			expect(actual).toBe('4242 4242 4242 4242');
		});
	});
});
