import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

describe('CardData', () => {
	describe('Card network', () => {
		it('should show MasterCard network symbol when provided', () => {
			addUrlParams({
				symbol: 'mastercard',
			});
			render(<App />);

			expect(screen.getByRole('main')).toHaveClass('Symbol--mastercard');
		});

		it('should show Visa blue network symbol when provided', () => {
			addUrlParams({
				symbol: 'Visa-blue',
			});
			render(<App />);

			expect(screen.getByRole('main')).toHaveClass('Symbol--Visa-blue');
		});

		it('should show Visa white network symbol when provided', () => {
			addUrlParams({
				symbol: 'Visa-white',
			});
			render(<App />);

			expect(screen.getByRole('main')).toHaveClass('Symbol--Visa-white');
		});

		it('should position the symbol bottom-right when position is not provided', () => {
			addUrlParams({
				symbol: 'mastercard',
			});
			render(<App />);

			expect(screen.getByRole('main')).toHaveClass('Symbol--bottom-right');
		});

		it('should position the symbol bottom-right when position is provided', () => {
			addUrlParams({
				symbol: 'mastercard',
				position: 'bottom-right',
			});
			render(<App />);

			expect(screen.getByRole('main')).toHaveClass('Symbol--bottom-right');
		});

		it('should position the symbol bottom-left when position is provided', () => {
			addUrlParams({
				symbol: 'mastercard',
				position: 'bottom-left',
			});
			render(<App />);

			expect(screen.getByRole('main')).toHaveClass('Symbol--bottom-left');
		});

		it('should position the symbol top-left when position is provided', () => {
			addUrlParams({
				symbol: 'mastercard',
				position: 'top-left',
			});
			render(<App />);

			expect(screen.getByRole('main')).toHaveClass('Symbol--top-left');
		});

		it('should position the symbol top-right when position is provided', () => {
			addUrlParams({
				symbol: 'mastercard',
				position: 'top-right',
			});
			render(<App />);

			expect(screen.getByRole('main')).toHaveClass('Symbol--top-right');
		});
	});
});

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
