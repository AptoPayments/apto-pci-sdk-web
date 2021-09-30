import React from 'react';
import { ITheme } from '../../../../types/IThemes';

interface IFormProps {
	handleSubmit: (e: React.FormEvent) => void;
	placeholder: string;
	theme: ITheme;
}

export default function SetPinForm(props: IFormProps) {
	return (
		<form style={props.theme.formOTP} onSubmit={props.handleSubmit} data-testid="set-pin-form">
			<div
				style={{
					display: 'flex',
				}}
			>
				<input
					style={props.theme.formOTPInput}
					autoComplete="off"
					required
					id="pin"
					name="pin"
					type="text"
					aria-label="Set pin code"
					placeholder={props.placeholder}
					pattern="\d*"
					inputMode="numeric"
				/>
				<button style={props.theme.formOTPSubmit} type="submit">
					Send
				</button>
			</div>
		</form>
	);
}
