/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    "prettier/@tpescript-eslint",
    "plugin:prettier/recommended"
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier'
  ],
  root: true,
  rules: {
    "no-console": "warn",
    "prettier/prettier": "error"
  }
};
