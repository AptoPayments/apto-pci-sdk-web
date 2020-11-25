// eslint-disable-next-line
module.exports = {
	extends: ['eslint:recommended', 'typescript', 'prettier'],
	ignorePatterns: [
		// '**/*.stories.tsx',
	],
	overrides: [
		{
			files: ['**/*.ts?(x)'],
			rules: {
				'@typescript-eslint/ban-types': 1,
				'@typescript-eslint/camelcase': 0,
				'@typescript-eslint/explicit-function-return-type': 0,
				'@typescript-eslint/explicit-module-boundary-types': 0,
				'@typescript-eslint/interface-name-prefix': 0,
				'@typescript-eslint/no-explicit-any': 0,
				'@typescript-eslint/prefer-as-const': 0, // TODO: Investigate this rule, maybe we want it
				'import/no-anonymous-default-export': 0, // We export anonymous services.
			},
		},
	],
};
