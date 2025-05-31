const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const eslintPluginImport = require('eslint-plugin-import');
//@ts-nocheck
const config = [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    // eslintPluginImport.configs.recommended,
    // single quotes
    {
        ignores: [
            'node_modules/',
            'dist/',
            'build/',
            'coverage/',
            'public/',
            'scripts/',
            'webpack/',
            'eslint.config.cjs',
        ],
    },
    {
        plugins: {
            import: eslintPluginImport,
        },
    },
    {
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            },
        },
        rules: {
            semi: ['warn', 'always'],
            quotes: ['warn', 'single'],
            '@typescript-eslint/no-unused-vars': ['warn'],
            '@typescript-eslint/explicit-function-return-type': [
                'warn',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                },
            ],
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'import/order': [
                'warn',
                {
                    'newlines-between': 'always',
                    groups: ['builtin', ['internal', 'external'], ['sibling', 'parent', 'index']],
                    pathGroups: [
                        {
                            pattern: '@apps/**',
                            group: 'external',
                            position: 'after',
                        },
                    ],
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
        },
    },
];

module.exports = config;
