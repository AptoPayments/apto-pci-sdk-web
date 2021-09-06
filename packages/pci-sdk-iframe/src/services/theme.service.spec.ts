import { ITheme } from '../types/IThemes';
import themeService from './theme.service';

describe('themeService', () => {
	describe('extendTheme', () => {
		it('should return custom styles if "style" object has no "extend" property', () => {
			const actual = themeService.extendTheme(dummy_style_full_custom);
			expect(actual).toEqual(dummy_style_full_custom);
		});

		it('should return custom styles if "extend" property is not a known theme', () => {
			const actual = themeService.extendTheme(dummy_style_unknown_theme);
			expect(actual).toEqual(dummy_style_unknown_theme);
		});

		it('should add and overwrite theme styles with custom styles', () => {
			const actual = themeService.extendTheme(dummy_style_with_theme);
			expect(actual).toEqual(dummy_style_default_theme_extended);
		});
	});
});

const dummy_style_full_custom: ITheme = {
	container: {
		color: 'red',
	},
	labelName: {
		fontSize: '30px',
	},
};

const dummy_style_unknown_theme: any = {
	extends: 'dummy_unknown_theme',
	container: {
		color: 'red',
	},
	labelName: {
		fontSize: '30px',
	},
};

const dummy_style_with_theme: ITheme = {
	extends: 'light',
	container: {
		color: 'red',
	},
	labelCvv: {
		marginRight: '45px',
		textDecoration: 'underline',
	},
	cvv: {
		fontSize: '24px',
	},
};

const dummy_style_default_theme_extended: ITheme = {
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		alignContent: 'flex-end',
		position: 'relative' as 'relative',
		width: '100%',
		height: '100%',
		padding: '4.70vw', //16px'
		color: 'red',
		fontFamily: 'monospace',
		fontSize: '4.7vw', //'16px'
		boxSizing: 'border-box',
		opacity: 1,
	},
	groups: {
		marginTop: '3.53vw', //'12px'
	},
	groupName: {
		order: 2,
		width: '100%',
		textTransform: 'uppercase' as 'uppercase',
	},
	groupPan: {
		order: 1,
		width: '100%',
		marginBottom: '4.70vw', // '16px'
	},
	groupCvv: {
		order: 4,
		display: 'inline-flex',
		alignItems: 'center',
	},
	groupExp: {
		order: 3,
		display: 'inline-flex',
		alignItems: 'center',
		marginRight: '5.88vw', //'20px'
	},
	labels: {
		display: 'none',
		fontSize: '3.53vw', //'12px',
		textTransform: 'uppercase' as 'uppercase',
	},
	labelCvv: {
		display: 'initial',
		marginRight: '45px',
		textDecoration: 'underline',
	},
	labelExp: {
		display: 'initial',
		marginRight: '2.94vw', //'10px',
	},
	pan: {
		fontSize: '7.06vw', //24px
	},
	cvv: {
		fontSize: '24px',
	},
	formOTP: {
		alignContent: 'center',
		display: 'flex',
		flexDirection: 'column',
		height: '92%',
		justifyContent: 'center',
		padding: '0 18vw',
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
	},
	formOTPInput: {
		width: '90%',
		margin: 'auto',
		padding: '2.35vw 3.52vw', //8px 12px
		border: '1px solid #ccc',
		borderRadius: '1.2vw 0 0 1.2vw',
		fontSize: '4.118vw', // '14px'
	},
	formOTPSubmit: {
		margin: '0',
		padding: '0 1rem',
		backgroundColor: '#ccc',
		border: '1px solid #ccc',
		borderRadius: '0 1.2vw 1.2vw 0',
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
		fontSize: '4.118vw', // '14px'
		cursor: 'pointer',
		boxSizing: 'border-box',
	},
	notification: {
		position: 'absolute',
		zIndex: 3,
		top: '4.706vw',
		left: '50%',
		width: '70%',
		padding: '2vw 4vw',
		transform: 'translateX(-50%)',
		borderRadius: '8px',
		backgroundColor: '#CBCBCB',
		color: '#141414',
		fontFamily: 'sans-serif',
		fontSize: '4.118vw',
		lineHeight: '1.5',
		textAlign: 'center',
	},
};
