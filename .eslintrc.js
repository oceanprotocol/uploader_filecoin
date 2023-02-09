module.exports = {
    parserOptions: {
        sourceType: 'module',
    },
    parser: 'babel-eslint',
    env: {
        node: true,
    },
    extends: [
        'standard',
        'prettier',
        'prettier/standard',
        'plugin:jest/recommended',
        'airbnb-base',
        'plugin:prettier/recommended',
    ],
    plugins: ['prettier', 'jest'],
    rules: {
        'promise/catch-or-return': 'error',
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                semi: false,
            },
        ],
    },
}
