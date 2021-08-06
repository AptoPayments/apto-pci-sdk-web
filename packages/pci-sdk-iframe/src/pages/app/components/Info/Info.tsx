import React from 'react';
import { ITheme } from '../../../../types/IThemes';

interface IInfoProps {
	message: string;
	theme: ITheme;
}

export default function Info(props: IInfoProps) {
	return <div style={props.theme.notification}>{props.message}</div>;
}
