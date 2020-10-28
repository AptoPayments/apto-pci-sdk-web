import dark from './dark';
import light from './light';

const themes = {
	'light': light,
	'dark': dark,
}

export type IThemeName = keyof typeof themes;

export default themes;
