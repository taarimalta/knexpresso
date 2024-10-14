// eslint.config.js

const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
    {
        files: ['**/*.{ts,js}'],
        ignores: ['dist', 'node_modules', 'coverage'], // Folders to ignore
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,  // TypeScript recommended rules
            'prettier/prettier': 'error',           // Enforce Prettier rules
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },          // Ignore variables prefixed with '_'
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-var-requires': 'off'
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'error',           // Enforce Prettier rules for JS files
        },
    },
];
