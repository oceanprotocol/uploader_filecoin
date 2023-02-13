module.exports = {
  parserOptions: {
    sourceType: 'module',
  },
  parser: '@babel/eslint-parser',
  env: {
    node: true,
  },
  extends: ['prettier', 'airbnb-base'],
  plugins: ['jest', 'prettier'],
  rules: {
    indent: 'off',
    'promise/catch-or-return': 0,
    'comma-dangle': 0,
    'object-curly-newline': 0,
    'implicit-arrow-linebreak': 0,
    'no-underscore-dangle': 0,
    'prettier/prettier': 'error',
    prettier: [
      'error',
      {
        singleQuote: true,
        semi: false,
      },
    ],
  },
};
