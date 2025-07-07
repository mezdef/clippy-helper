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
    plugins: ['prettier', '@typescript-eslint', 'import'],
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

      // Import organization
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],

      // Encourage using index imports for component directories
      'import/no-internal-modules': [
        'warn',
        {
          forbid: [
            // Encourage using index imports for these component directories
            '@/components/ui/Button',
            '@/components/ui/Avatar',
            '@/components/ui/Error',
            '@/components/ui/loading/LoadingPage',
            '@/components/ui/loading/LoadingSpinner',
            '@/components/ui/forms/Form',
            '@/components/ui/forms/Input',
            '@/components/ui/forms/Textarea',
            '@/components/ui/forms/FormField',
          ],
        },
      ],
    },
  }),
];

export default eslintConfig;
