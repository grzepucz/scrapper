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
        indent: ['error', 4],
        'import/no-unresolved': [1, { caseSensitive: false }],
        'class-methods-use-this': [0, { exceptMethods: [] }],
        'no-plusplus': 0,
        'max-len': [1, {
            ignoreStrings: true, code: 120, ignoreUrls: true, tabWidth: 2,
        }],
    },
};
