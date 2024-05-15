module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'linebreak-style': 'off',
	},
	overrides: [
		{
			rules: {
				'max-len': ['error', { code: 160, comments: 170, ignoreRegExpLiterals: true }],
				'no-console': 'off',
				'import/order': 'off',
				'consistent-return': 'off',
				'object-curly-newline': 'off',
				'object-curly-spacing': 'off',
				'object-property-newline': 'off',
				'import/prefer-default-export': 'off',
				'@typescript-eslint/comma-dangle': 'off',
				'@typescript-eslint/no-unused-vars': 'off',
				'@typescript-eslint/default-param-last': 'off',
				'@typescript-eslint/object-curly-newline': 'off',
				'@typescript-eslint/no-use-before-define': 'off',
				'@typescript-eslint/object-curly-spacing': ['error', 'always', { objectsInObjects: true }],
				'prettier/prettier': 'off',
			},
		},
	],
};
