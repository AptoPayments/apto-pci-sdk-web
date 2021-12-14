import React from 'react';
import { ITheme } from 'types/IThemes';
import './Notification.css';

interface INotificationProps {
	message: string;
	theme?: ITheme;
	type?: 'positive' | 'negative';
}

export default function Notification(props: INotificationProps) {
	return (
		<div
			className={`Notification Notification--${props.type ? props.type : 'positive'}`}
			style={props.type === 'positive' ? props.theme?.notification?.positive : props.theme?.notification?.negative}
			data-testid="notification"
		>
			<div
				className={`Notification__icon Notification__icon--${props.type ? props.type : 'positive'}`}
				style={props.type === 'positive' ? props.theme?.notification?.positive : props.theme?.notification?.negative}
			></div>
			<span>{props.message}</span>
		</div>
	);
}
