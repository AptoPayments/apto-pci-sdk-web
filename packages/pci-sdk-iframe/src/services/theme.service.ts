import themes from 'pages/app/themes/index';
import IStateFn from 'types/IStateFn';
import IThemeName from 'types/IThemeName';
import { ITheme } from 'types/IThemes';

interface ISetStyleArgs {
	dispatch: IStateFn;
	style: ITheme;
}

function setStyle({ dispatch, style }: ISetStyleArgs) {
	return dispatch({ theme: extendTheme(style) });
}

interface ISetThemeArgs {
	dispatch: IStateFn;
	theme: IThemeName;
}

function setTheme({ dispatch, theme }: ISetThemeArgs) {
	return dispatch({ theme: themes[theme] });
}

function extendTheme(styles: ITheme) {
	const theme = _getTheme(styles);

	if (theme) {
		const themeDeepClone = JSON.parse(JSON.stringify(theme));
		return _mergeStyles(styles, themeDeepClone);
	}

	return styles;
}

function _getTheme(styles: ITheme) {
	const themeName: IThemeName | undefined = styles.extends;
	return themeName && themes[themeName] ? themes[themeName] : undefined;
}

function _mergeStyles(styles: ITheme, baseTheme: ITheme) {
	return Object.entries(styles).reduce((mergedStyles: ITheme, [key, style]) => {
		if (key === 'extends') {
			return mergedStyles;
		}

		// This should be unreachable unless a theme is missing a possible selector, added for redundency
		if (!baseTheme[key as keyof ITheme]) {
			mergedStyles[key as keyof ITheme] = style;
			return mergedStyles;
		}

		mergedStyles[key as keyof ITheme] = Object.assign(baseTheme[key as keyof ITheme], style);
		return mergedStyles;
	}, baseTheme);
}

export default {
	setStyle,
	setTheme,
	extendTheme,
};
