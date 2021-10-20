import React from 'react';
import { ITheme } from 'types/IThemes';
import './CardData.css';

interface ICardDataProps {
	cvv: string;
	exp: string;
	isLoading: boolean;
	labelCvv: string;
	labelExp: string;
	labelName: string;
	labelPan: string;
	nameOnCard: string;
	pan: string;
	theme: ITheme;
	networkLogoPosition: string;
	networkLogoSymbol: string;
}

export default function CardData(props: ICardDataProps) {
	return (
		<main
			id="container"
			data-testid="card-container"
			style={{ ...props.theme.container }}
			className={`Symbol--${props.networkLogoSymbol} Symbol--${props.networkLogoPosition}`}
		>
			<div id="group-name" style={{ ...props.theme.groups, ...props.theme.groupName }}>
				<label id="label-name" style={{ ...props.theme.labels, ...props.theme.labelName }}>
					{props.labelName}
				</label>
				<span id="name" data-testid="cardholder-name" style={{ ...props.theme.shared, ...props.theme.name }}>
					{props.nameOnCard}
				</span>
			</div>

			<div id="group-pan" style={{ ...props.theme.groups, ...props.theme.groupPan }}>
				<label id="label-pan" style={{ ...props.theme.labels, ...props.theme.labelPan }}>
					{props.labelPan}
				</label>
				<span
					className={props.isLoading ? 'CardData__item isLoading' : ''}
					id="pan"
					style={{ ...props.theme.shared, ...props.theme.pan }}
				>
					{props.pan}
				</span>
			</div>

			<div id="group-cvv" style={{ ...props.theme.groups, ...props.theme.groupCvv }}>
				<label id="label-cvv" style={{ ...props.theme.labels, ...props.theme.labelCvv }}>
					{props.labelCvv}
				</label>
				<span
					className={props.isLoading ? 'CardData__item isLoading' : ''}
					id="cvv"
					style={{ ...props.theme.shared, ...props.theme.cvv }}
				>
					{props.cvv}
				</span>
			</div>

			<div id="group-exp" style={{ ...props.theme.groups, ...props.theme.groupExp }}>
				<label id="label-exp" style={{ ...props.theme.labels, ...props.theme.labelExp }}>
					{props.labelExp}
				</label>
				<span
					className={props.isLoading ? 'CardData__item isLoading' : ''}
					id="exp"
					style={{ ...props.theme.shared, ...props.theme.exp }}
				>
					{props.exp}
				</span>
			</div>
		</main>
	);
}
