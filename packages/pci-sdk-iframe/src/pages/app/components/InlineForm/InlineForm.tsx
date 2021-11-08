import React from 'react';
import { ITheme } from 'types/IThemes';
import './InlineForm.css';

interface IInlineFormProps {
	ariaLabel: string;
	autoComplete?: string;
	handleSubmit: (e: React.FormEvent) => void;
	id: string;
	placeholder: string;
	required?: boolean;
	theme: ITheme;
}

export default function InlineForm(props: IInlineFormProps) {
	return (
		<form className="InlineForm" style={props.theme.inlineForm} onSubmit={props.handleSubmit} data-testid="inline-form">
			<input
				className="InlineForm__input"
				style={props.theme.inlineFormInput}
				autoComplete={props.autoComplete}
				required={props.required}
				id={props.id}
				name={props.id}
				type="text"
				aria-label={props.ariaLabel}
				placeholder={props.placeholder}
				pattern="\d*"
				inputMode="numeric"
			/>
			<button className="InlineForm__submit" style={props.theme.inlineFormSubmit} type="submit">
				Send
			</button>
		</form>
	);
}
