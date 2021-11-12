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
	notification?: CSSProperties;
	inlineForm?: {
		container?: CSSProperties;
		input?: CSSProperties;
		submit?: CSSProperties;
	};
}
