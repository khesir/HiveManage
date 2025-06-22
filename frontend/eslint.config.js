import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		ignores: ['src/components/ui/'], // Use "ignores" to specify files and directories to ignore
	},
	{languageOptions: {globals: globals.browser}},
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	eslintPluginPrettierRecommended,
	eslintConfigPrettier,
	{
		settings: {
			react: {
				version: 'detect', // Automatically detect the version of React
			},
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',
			'react/jsx-filename-extension': [
				1,
				{extensions: ['.js', '.jsx', '.ts', '.tsx']},
			],
			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
					trailingComma: 'all',
					semi: true,
					tabWidth: 2,
				},
			],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: true,
				},
			],
			'@typescript-eslint/no-explicit-any': [
				'error',
				{
					fixToUnknown: false,
					ignoreRestArgs: false,
				},
			],
		},
	},
];
