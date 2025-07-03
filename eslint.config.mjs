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
  {
    plugins: ['prettier', '@typescript-eslint'],
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',
      
      // Disable formatting rules that Prettier handles
      'indent': 'off',
      'comma-dangle': 'off',
      'semi': 'off',
      'quotes': 'off',
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      'comma-spacing': 'off',
      'key-spacing': 'off',
      // Disallow explicit any
      '@typescript-eslint/no-explicit-any': 'error',
      // Require explicit return types on module boundaries
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },
];

export default eslintConfig;
