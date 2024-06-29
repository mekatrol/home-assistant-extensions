/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    //
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'prettier'
  ],
  plugins: [
    // required to apply rules which need type information
    '@typescript-eslint'
  ],

  parserOptions: {
    ecmaVersion: 'latest'
  },

  rules: {
    'prefer-promise-reject-errors': 'error',

    'max-len': ['error', 150],

    // An error not to use single quotes
    quotes: [
      'error',
      'single',
      {
        // If strings contain quotes within string then either quote style can be used
        // eg: 'single containing "double"' or "double containing 'single'"
        avoidEscape: true,

        // Template (back tick quote) literals are not allowed
        // Back tick (interpolation) strings must have at least one parameter to be valid
        // eg must use 'literal' and not `literal`, but `literal ${param}` is OK
        allowTemplateLiterals: false
      }
    ],

    semi: [2, 'always'],

    'comma-dangle': ['error', 'never'],
    '@typescript-eslint/comma-dangle': 'error',

    // this rule, if on, would require explicit return type on the `render` function
    '@typescript-eslint/explicit-function-return-type': 'error',

    // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
    '@typescript-eslint/no-var-requires': 'off',

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'array-element-newline': [
      'error',
      {
        ArrayExpression: 'consistent',
        ArrayPattern: { minItems: 3 }
      }
    ],

    'no-console':
      process.env.NODE_ENV === 'production' ? ['error', { allow: ['info', 'warn', 'error'] }] : ['warn', { allow: ['log', 'info', 'warn', 'error'] }],

    // The core 'no-unused-vars' rules (in the eslint:recommended rule set)
    // does not work with type definitions
    'no-unused-vars': 'off',

    // Should use 'const' and 'let', but not 'var' for declaration variables
    // 'var' has global scope!
    'no-var': 'error',

    // We want underscore param to not trigger the warning
    '@typescript-eslint/no-unused-vars': [
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      {
        argsIgnorePattern: '^_.*$',
        varsIgnorePattern: '^_.*$',
        caughtErrorsIgnorePattern: '^_.*$'
      }
    ]
  }
};
