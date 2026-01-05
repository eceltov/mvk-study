import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/*',
      '!client/**',
      '!server/**',
      'client/build/**',
      'client/node_modules/**',
      'server/node_modules/**'
    ]
  },
  js.configs.recommended,
  {
    files: ['client/**/*.{js,jsx}', 'server/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      react: reactPlugin
    },
    rules: {
      indent: ['error', 4, { SwitchCase: 1 }],
      'brace-style': ['error', 'stroustrup', { allowSingleLine: false }],
      curly: ['error', 'all'],
      'no-multi-spaces': 'error',
      'no-trailing-spaces': ['error', { skipBlankLines: false, ignoreComments: false }],
      'eol-last': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': ['error', { 'varsIgnorePattern': '^React$' }]
    },
    settings: {
      react: { version: 'detect' }
    }
  }
];
