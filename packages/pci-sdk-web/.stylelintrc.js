module.exports = {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-property-sort-order-smacss',
		'stylelint-config-css-modules',
		'stylelint-config-prettier',
	],
	rules: {
		'selector-pseudo-element-colon-notation': 'double',
		'color-hex-length': 'long',
		'at-rule-no-unknown': null,
		'value-keyword-case': null,
		'property-no-unknown': [
			true,
			{
				ignoreProperties: ['composes', 'compose-with'],
			},
		],
	},
	ignoreFiles: ['**/*.ts', '**/*.tsx'],
};
