/*
 * @Date: 2020-06-03 15:21:58
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2023-08-14 16:10:16
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended', 'airbnb-base'],
  rules: {
    'linebreak-style': 0,
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-unused-components': 0,
    'no-unused-vars': 0,
    'import/order': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'comma-dangle': [2, 'never'],
    'semi': 0,
    'no-unused-expressions': 0,
    'no-plusplus': 0,
    'import/prefer-default-export': 0,
    'no-use-before-define': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'arrow-parens': [2, 'as-needed'],
    'vue/max-attributes-per-line': 0,
    'max-len': [
      1,
      {
        code: 300
      }
    ],
    'no-eval': 0,
    'no-multi-assign': 0,
    'prefer-rest-params': 0,
    'vue/require-prop-types': 0,
    'no-restricted-globals': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    location: false
  }
};
