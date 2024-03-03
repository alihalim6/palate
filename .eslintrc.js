module.exports = {
  extends: ['next/core-web-vitals', 'eslint:recommended', '@typescript-eslint/eslint-plugin'],
  plugins: ['simple-import-sort', 'plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/stylistic'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error'
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