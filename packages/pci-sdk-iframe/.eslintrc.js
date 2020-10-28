module.exports = {
	extends: [
		"react-app",
		"typescript",
		"typescript/react",
	],
	rules: {
		'@typescript-eslint/ban-types': 1,
		'@typescript-eslint/camelcase': 0,
		'@typescript-eslint/explicit-function-return-type': 0,
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'@typescript-eslint/interface-name-prefix': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/semi': ["error"],
		'react/prop-types': 0, // we use typescript iterfaces, we don't need this
		'react/no-unescaped-entities': 0, // We disable this because aleja likes reading the characters
		'indent': ['error', 'tab', { "SwitchCase": 1 }],
		'quotes': ['error', 'single'],
		'semi': 0,
	}
}
