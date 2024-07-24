module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'prettier',
    'plugin:@typescript-eslint/stylistic',
    'plugin:tailwindcss/recommended',
  ],
  plugins: ['simple-import-sort', '@typescript-eslint'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'tailwindcss/enforces-negative-arbitrary-values': 'off',
  },
  parser: '@typescript-eslint/parser',
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
