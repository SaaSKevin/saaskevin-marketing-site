const js = require('@eslint/js');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const globals = require('globals');

const nextPlugin = require('@next/eslint-plugin-next');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const prettierConfig = require('eslint-config-prettier');

// Next.js plugin exports changed across versions; prefer flat-config exports when
// available, otherwise map legacy configs into flat-config shape.
const nextFlatCoreWebVitalsConfig =
  nextPlugin.flatConfig?.coreWebVitals ??
  nextPlugin.flatConfig?.['core-web-vitals'] ??
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...(nextPlugin.configs?.recommended?.rules ?? {}),
      ...(nextPlugin.configs?.['core-web-vitals']?.rules ??
        nextPlugin.configs?.coreWebVitals?.rules ??
        nextPlugin.configs?.['coreWebVitals']?.rules ??
        {}),
    },
  };

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: [
      '.next',
      'out',
      'coverage',
      '**/node_modules',
      'eslint.config.cjs',
      'next-env.d.ts',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 13,
      sourceType: 'module',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  js.configs.recommended,
  ...typescriptEslint.configs['flat/recommended'],
  reactPlugin.configs.flat.recommended,
  {
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
  },
  nextFlatCoreWebVitalsConfig,
  prettierConfig,
  {
    rules: {
      'react/no-unknown-property': 'off',
      'react/prop-types': 'off',
      'react-hooks/purity': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
];

