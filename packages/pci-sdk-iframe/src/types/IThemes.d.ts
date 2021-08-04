export interface ITheme {
	extends?: IThemeName;
	container?: CSSProperties;
	shared?: CSSProperties;
	groups?: CSSProperties;
	groupName?: CSSProperties;
	groupPan?: CSSProperties;
	groupCvv?: CSSProperties;
	groupExp?: CSSProperties;
	labels?: CSSProperties;
	labelName?: CSSProperties;
	labelPan?: CSSProperties;
	labelCvv?: CSSProperties;
	labelExp?: CSSProperties;
	name?: CSSProperties;
	pan?: CSSProperties;
	cvv?: CSSProperties;
	exp?: CSSProperties;
	form2FA?: CSSProperties;
	form2FAInput?: CSSProperties;
	form2FASubmit?: CSSProperties;
}
