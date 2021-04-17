module.exports = {
  env: {
    browser: true,
    es2020: true,
    commonjs: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    indent: ['error', 2],
    'import/no-unresolved': [1, { caseSensitive: false }],
    'class-methods-use-this': [1, { exceptMethods: [] }],
  },
};
