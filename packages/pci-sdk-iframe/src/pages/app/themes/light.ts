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
		color: 'black',
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
		marginBottom: '3.53vw', // '12px'
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
		height: '100%',
		justifyContent: 'center',
		padding: '0 15vw',
	},
	formOTPInput: {
		width: '90%',
		margin: 'auto',
		fontSize: '3.53vw', // '12px'
		padding: '2.35vw',
		borderRadius: '1.2vw 0 0 1.2vw',
		border: '1px solid #ccc',
	},
	formOTPSubmit: {
		padding: '0 1rem',
		backgroundColor: '#ccc',
		border: '1px solid #ccc',
		borderRadius: '0 1.2vw 1.2vw 0',
		cursor: 'pointer',
		fontSize: '3.53vw', // '12px'
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
		backgroundColor: '#CBCBCB',
		color: '#141414',
		fontFamily: 'sans-serif',
		fontSize: '4.118vw',
		lineHeight: '1.5',
		textAlign: 'center',
	},
};
