import React from 'react';
import { ITheme } from '../../../../types/IThemes';

interface IInfoProps {
	message: string;
	theme: ITheme;
}
export default function Info(props: IInfoProps) {
	const color = props.theme.container['color'];
	return (
		<div
			style={{
				position: 'absolute',
				width: '100%',
				padding: '5vw',
				fontFamily: 'sans-serif',
				textAlign: 'center',
				color: color,
				boxSizing: 'border-box',
			}}
		>
			{props.message}
		</div>
	);
}
