import { render, screen } from '@testing-library/react';
import React from 'react';
import { ITheme } from 'types/IThemes';
import Notification from './Notification';

describe('Notification', () => {
	describe('Notification type', () => {
		it('should render a positive notification when type is not passed', () => {
			render(<Notification message="dummy_notification" />);

			expect(screen.queryByTestId('notification')).toHaveClass('Notification--positive');
		});

		it('should render a positive notification when type is positive', () => {
			render(<Notification message="dummy_notification" type="positive" />);

			expect(screen.queryByTestId('notification')).toHaveClass('Notification--positive');
		});

		it('should render a positive notification when type is negative', () => {
			render(<Notification message="dummy_notification" type="negative" />);

			expect(screen.queryByTestId('notification')).toHaveClass('Notification--negative');
		});

		it('should style the notification when type is positive and a custom theme is being passed', () => {
			render(<Notification message="dummy_notification" type="positive" theme={dummy_style_full_custom_positive} />);

			expect(screen.getByTestId('notification').getAttribute('style')).toBe('background-color: green;');
		});

		it('should style the notification when type is negative and a custom theme is being passed', () => {
			render(<Notification message="dummy_notification" type="negative" theme={dummy_style_full_custom_negative} />);

			expect(screen.getByTestId('notification').getAttribute('style')).toBe('background-color: red;');
		});
	});
});

const dummy_style_full_custom_positive: ITheme = {
	notification: {
		positive: {
			backgroundColor: 'green',
		},
	},
};
const dummy_style_full_custom_negative: ITheme = {
	notification: {
		negative: {
			backgroundColor: 'red',
		},
	},
};
