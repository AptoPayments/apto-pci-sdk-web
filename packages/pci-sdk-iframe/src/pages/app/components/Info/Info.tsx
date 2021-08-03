import React from 'react';

interface IInfoProps {
	message: string;
}
export default function Info(props: IInfoProps) {
	return (
		<div
			style={{
				fontFamily: 'sans-serif',
				padding: '5vw',
				position: 'absolute',
			}}
		>
			{props.message}
		</div>
	);
}
