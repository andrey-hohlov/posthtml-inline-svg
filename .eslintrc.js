module.exports = {
  env:  {
    es6: true,
    node: true,
    browser:  false,
    mocha: true
  },
  extends: 'eslint:recommended',
  parserOptions:  {
    sourceType: 'module',
    ecmaVersion: 2017,
  },
  rules:  {
    'no-async-promise-executor': 'off'
  },
};
