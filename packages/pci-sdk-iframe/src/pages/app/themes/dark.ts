// TODO: group this with context: `cardData: { ... }, form2FA: { ... }` in the next major release
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
		marginBottom: '3.53vw', //'12px'
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
	form2FA: {
		alignContent: 'center',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		justifyContent: 'center',
		padding: '0 15vw',
	},
	form2FAInput: {
		width: '90%',
		margin: 'auto',
		fontSize: '3.53vw', // '12px'
		padding: '2.35vw',
		backgroundColor: '#424242',
		borderRadius: '1.2vw 0 0 1.2vw',
		border: '1px solid #424242',
		color: 'white',
	},
	form2FASubmit: {
		padding: '0 1rem',
		backgroundColor: '#212121',
		border: '1px solid #000',
		borderRadius: '0 1.2vw 1.2vw 0',
		cursor: 'pointer',
		fontSize: '3.53vw', // '12px'
		color: 'white',
	},
};
