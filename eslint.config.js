export default [
  {
    files: ['src/**/*.js', '__tests__/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],
    },
  },
];
