import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

describe('CardData', () => {
	describe('Card network', () => {
		describe('symbol', () => {
			it('should show MasterCard network symbol when provided', () => {
				addUrlParams({
					networkLogoSymbol: 'mastercard',
				});
				render(<App />);

				expect(screen.getByTestId('card-networkLogo')).toHaveClass('Symbol--mastercard');
			});

			it('should show Visa blue network symbol when provided', () => {
				addUrlParams({
					networkLogoSymbol: 'visa-blue',
				});
				render(<App />);

				expect(screen.getByTestId('card-networkLogo')).toHaveClass('Symbol--visa-blue');
			});

			it('should show Visa white network symbol when provided', () => {
				addUrlParams({
					networkLogoSymbol: 'visa-white',
				});
				render(<App />);

				expect(screen.getByTestId('card-networkLogo')).toHaveClass('Symbol--visa-white');
			});
		});

		describe('position', () => {
			it('should position the symbol bottom-right when position is not provided', () => {
				addUrlParams({
					networkLogoSymbol: 'mastercard',
				});
				render(<App />);

				expect(screen.getByTestId('card-networkLogo')).toHaveClass('Symbol--bottom-right');
			});

			it('should position the symbol bottom-right when position is provided', () => {
				addUrlParams({
					networkLogoSymbol: 'mastercard',
					networkLogoPosition: 'bottom-right',
				});
				render(<App />);

				expect(screen.getByTestId('card-networkLogo')).toHaveClass('Symbol--bottom-right');
			});

			it('should position the symbol bottom-left when position is provided', () => {
				addUrlParams({
					networkLogoSymbol: 'mastercard',
					networkLogoPosition: 'bottom-left',
				});
				render(<App />);

				expect(screen.getByTestId('card-networkLogo')).toHaveClass('Symbol--bottom-left');
			});

			it('should position the symbol top-left when position is provided', () => {
				addUrlParams({
					networkLogoSymbol: 'mastercard',
					networkLogoPosition: 'top-left',
				});
				render(<App />);

				expect(screen.getByTestId('card-networkLogo')).toHaveClass('Symbol--top-left');
			});

			it('should position the symbol top-right when position is provided', () => {
				addUrlParams({
					networkLogoSymbol: 'mastercard',
					networkLogoPosition: 'top-right',
				});
				render(<App />);

				expect(screen.getByTestId('card-networkLogo')).toHaveClass('Symbol--top-right');
			});
		});

		describe('size', () => {
			it('should add custom CSS style to set the backgroundSize when provided', () => {
				addUrlParams({
					networkLogoSymbol: 'mastercard',
					networkLogoWidth: '20vw',
					networkLogoHeight: '10vw',
				});
				render(<App />);

				expect(screen.getByTestId('card-networkLogo').getAttribute('style')).toBe('background-size: 20vw 10vw;');
			});
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
