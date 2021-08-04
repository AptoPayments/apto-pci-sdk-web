import React from 'react';
import { ITheme } from '../../../../types/IThemes';

interface IFormProps {
	handleSubmit: (e: React.FormEvent) => void;
	placeholder: string;
	theme: ITheme;
}

export default function Form(props: IFormProps) {
	return (
		<form style={props.theme.formOTP} onSubmit={props.handleSubmit} data-testid="2fa-form">
			<div
				style={{
					display: 'flex',
				}}
			>
				<input
					style={props.theme.formOTPInput}
					autoComplete="off"
					required
					id="code"
					name="code"
					type="text"
					aria-label="2FA code"
					placeholder={props.placeholder}
				/>
				<button style={props.theme.formOTPSubmit} type="submit">
					Send
				</button>
			</div>
		</form>
	);
}
