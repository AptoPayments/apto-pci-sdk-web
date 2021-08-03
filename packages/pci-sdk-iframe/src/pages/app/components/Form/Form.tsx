import React from 'react';

interface IFormProps {
	handleSubmit: (e: React.FormEvent) => void;
	placeholder: string;
}

export default function Form(props: IFormProps) {
	return (
		<form
			style={{
				alignContent: 'center',
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				justifyContent: 'center',
				padding: '5vw',
			}}
			onSubmit={props.handleSubmit}
			data-testid="2fa-form"
		>
			<div
				style={{
					display: 'flex',
				}}
			>
				<input
					style={{
						width: '90%',
						margin: 'auto',
						fontSize: '4.7vw', //'16px',
						padding: '2.35vw', //'16px',
						borderRadius: '1.2vw 0 0 1.2vw',
						border: '1px solid #ccc',
					}}
					autoComplete="off"
					required
					id="code"
					name="code"
					type="text"
					aria-label="2FA code"
					placeholder={props.placeholder}
				/>
				<button
					style={{
						cursor: 'pointer',
						padding: '0 1rem',
						borderRadius: '0 1.2vw 1.2vw 0',
						border: '1px solid #ccc',
					}}
					type="submit"
				>
					{' '}
					OK{' '}
				</button>
			</div>
		</form>
	);
}
