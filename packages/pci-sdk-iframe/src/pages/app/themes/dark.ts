// TODO: group this with context: `cardData: { ... }, formOTP: { ... }` in the next major release
export default {
	// Card Data
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		alignContent: 'flex-end',
		position: 'relative' as 'relative',
		width: '100%',
		height: '100%',
		padding: '4.70vw', //16px'
		color: 'white',
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
		marginRight: '2.94vw', //'10px',
	},
	labelExp: {
		display: 'initial',
		marginRight: '2.94vw', //'10px',
	},
	pan: {
		fontSize: '7.06vw', //24px
	},
	// 2FA Form
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
		fontSize: '4.118vw', // '14px'
		padding: '2.35vw 3.52vw', //8px 12px
		backgroundColor: '#424242',
		borderRadius: '1.2vw 0 0 1.2vw',
		border: '1px solid #424242',
		color: 'white',
	},
	formOTPSubmit: {
		padding: '0 1rem',
		backgroundColor: '#212121',
		border: '1px solid #000',
		borderRadius: '0 1.2vw 1.2vw 0',
		cursor: 'pointer',
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
		fontSize: '4.118vw', // '14px'
		color: 'white',
		boxSizing: 'border-box',
		margin: '0',
	},
	// Notification
	notification: {
		position: 'absolute',
		zIndex: 3,
		top: '4.706vw',
		left: '50%',
		width: '70%',
		padding: '2vw 4vw',
		transform: 'translateX(-50%)',
		borderRadius: '8px',
		backgroundColor: '#141414',
		color: '#CBCBCB',
		fontFamily: 'sans-serif',
		fontSize: '4.118vw',
		lineHeight: '1.5',
		textAlign: 'center',
	},
};
