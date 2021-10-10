module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],

  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    semi: ['error', 'never'],
    'no-param-reassign': [2, { props: false }],
    'no-continue': 'off',
    'max-len': ['error', { code: 120 }],
    'no-return-assign': 'off',
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',
  },
}
