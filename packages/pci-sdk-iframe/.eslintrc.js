module.exports = {
	extends: ['react-app', 'typescript', 'typescript/react', 'prettier'],
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
				'react/no-unescaped-entities': 0, // We disable this because aleja likes reading the characters
				'react/prop-types': 0, // we use typescript iterfaces, we don't need this
			},
		},
	],
};
