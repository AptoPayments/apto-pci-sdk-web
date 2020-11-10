import {ITheme } from '../types/IThemes';
import themes, { IThemeName } from '../pages/app/themes/index';


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
	extendTheme,
};
