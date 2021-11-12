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
	testID?: string;
	theme: ITheme;
}

export default function InlineForm(props: IInlineFormProps) {
	return (
		<form
			className="InlineForm"
			style={props.theme.inlineForm?.container}
			onSubmit={props.handleSubmit}
			data-testid={props.testID}
		>
			<input
				className="InlineForm__input"
				style={props.theme.inlineForm?.input}
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
			<button className="InlineForm__submit" style={props.theme.inlineForm?.submit} type="submit">
				Send
			</button>
		</form>
	);
}
