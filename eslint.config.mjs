import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.extends('prettier'), // Disable ESLint rules that conflict with Prettier
  ...compat.config({
    plugins: ['prettier', '@typescript-eslint'],
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // Disable formatting rules that Prettier handles
      indent: 'off',
      'comma-dangle': 'off',
      semi: ['error', 'always'],
      quotes: 'off',
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      'comma-spacing': 'off',
      'key-spacing': 'off',

      // TypeScript specific rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',

      // Unused code rules - error on all unused code
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off', // Turn off base rule as it conflicts with @typescript-eslint version

      // Import/export rules
      'no-unused-private-class-members': 'error',
    },
  }),
];

export default eslintConfig;
