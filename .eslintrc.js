module.exports = {
  // root: true,
  // env: {
  //   node: true,
  //   es6: true,
  // },
  // parserOptions: {
  //   ecmaVersion: 'latest',
  // },
  // parser: '@typescript-eslint/parser',
  // extends: [
  //   'eslint:recommended',
  //   'plugin:promise/recommended',
  //   'plugin:sonarjs/recommended',
  // ],
  // plugins: [
  //   'promise',
  //   'sonarjs',
  //   '@typescript-eslint',
  // ],
  // rules: {
  //   'space-infix-ops': 'error',
  //   'comma-dangle': ['error', 'always-multiline'],
  //   'no-unreachable': 'error',
  //   semi: ['error', 'always'],
  //   'sonarjs/no-nested-template-literals': 'off',
  //   'require-await': 'error',
  //   'no-param-reassign': ['error', { ignorePropertyModificationsFor: ['state'] }],
  //   'arrow-body-style': 0,
  //   'no-underscore-dangle': 'off',
  //   'no-restricted-syntax': 'off',
  //   'class-methods-use-this': 'off',
  //   'no-use-before-define': ['error', { functions: false, classes: false, variables: false }],
  //   'no-restricted-globals': 'off',
  //   'no-bitwise': 'off',
  //   'func-names': 'off',
  //   'promise/always-return': 'off',
  //   'promise/catch-or-return': [
  //     'error',
  //     {
  //       allowFinally: true,
  //     },
  //   ],
  //   'prefer-destructuring': 0,
  //   'no-alert': 'off',
  //   'no-eval': 'error',
  //   'no-extend-native': 0,
  //   curly: [
  //     'error',
  //     'multi-line',
  //   ],
  //   'no-else-return': 0,
  //   'no-eq-null': 'error',
  //   'no-labels': 'error',
  //   'no-new': 'error',
  //   'no-new-func': 'error',
  //   'no-new-wrappers': 'error',
  //   'no-loss-of-precision': 'error',
  //   'max-classes-per-file': [
  //     'error',
  //     1,
  //   ],
  //   'no-constructor-return': 'error',
  //   'no-promise-executor-return': 'error',
  //   'array-callback-return': 'error',
  //   'no-extra-bind': 'error',
  //   'no-implicit-globals': 'error',
  //   'no-implied-eval': 'error',
  //   'no-invalid-this': 'off',
  //   'no-lone-blocks': 'error',
  //   'no-multi-spaces': 'error',
  //   'no-self-compare': 'error',
  //   'no-useless-call': 'error',
  //   'no-useless-concat': 'error',
  //   'no-void': 'error',
  //   'wrap-iife': [
  //     'error',
  //     'inside',
  //   ],
  //   'no-label-var': 'error',
  //   'no-undef-init': 'error',
  //   'array-bracket-newline': [
  //     'error',
  //     'consistent',
  //   ],
  //   'array-bracket-spacing': [
  //     'error',
  //     'never',
  //   ],
  //   'array-element-newline': [
  //     'error',
  //     'consistent',
  //   ],
  //   'brace-style': [
  //     'error',
  //     '1tbs',
  //   ],
  //   'comma-spacing': [
  //     'error',
  //     {
  //       before: false,
  //       after: true,
  //     },
  //   ],
  //   'comma-style': [
  //     'error',
  //     'last',
  //   ],
  //   'computed-property-spacing': [
  //     'error',
  //     'never',
  //   ],
  //   'consistent-this': [
  //     'error',
  //     'self',
  //   ],
  //   'func-name-matching': 'error',
  //   'func-style': [
  //     'error',
  //     'declaration',
  //     {
  //       allowArrowFunctions: true,
  //     },
  //   ],
  //   'function-call-argument-newline': [
  //     'error',
  //     'consistent',
  //   ],
  //   'function-paren-newline': [
  //     'error',
  //     'multiline',
  //   ],
  //   'implicit-arrow-linebreak': [
  //     'error',
  //     'beside',
  //   ],
  //   'key-spacing': [
  //     'error',
  //     {
  //       beforeColon: false,
  //       afterColon: true,
  //       mode: 'strict',
  //     },
  //   ],
  //   'keyword-spacing': [
  //     'error',
  //     {
  //       before: true,
  //       after: true,
  //     },
  //   ],
  //   'multiline-ternary': [
  //     'error',
  //     'never',
  //   ],
  //   'new-parens': [
  //     'error',
  //     'always',
  //   ],
  //   'no-array-constructor': 'error',
  //   'no-inline-comments': 0,
  //   'no-lonely-if': 'error',
  //   'no-mixed-operators': 'off',
  //   'no-multiple-empty-lines': [
  //     'error',
  //     {
  //       max: 2,
  //       maxEOF: 0,
  //       maxBOF: 0,
  //     },
  //   ],
  //   'no-new-object': 'error',
  //   'no-tabs': 'error',
  //   'no-unneeded-ternary': 'error',
  //   'no-whitespace-before-property': 'error',
  //   'nonblock-statement-body-position': [
  //     'error',
  //     'beside',
  //   ],
  //   'object-curly-newline': [
  //     'error',
  //     {
  //       consistent: true,
  //     },
  //   ],
  //   'object-curly-spacing': [
  //     'error',
  //     'always',
  //   ],
  //   'object-property-newline': [
  //     'error',
  //     {
  //       allowMultiplePropertiesPerLine: true,
  //     },
  //   ],
  //   'one-var': [
  //     'error',
  //     'never',
  //   ],
  //   'one-var-declaration-per-line': [
  //     'error',
  //     'initializations',
  //   ],
  //   'operator-assignment': [
  //     'error',
  //     'always',
  //   ],
  //   'padded-blocks': [
  //     'error',
  //     'never',
  //   ],
  //   'quote-props': [
  //     'error',
  //     'as-needed',
  //   ],
  //   quotes: [
  //     'error',
  //     'single',
  //   ],
  //   'semi-spacing': [
  //     'error',
  //     {
  //       before: false,
  //       after: true,
  //     },
  //   ],
  //   'semi-style': [
  //     'error',
  //     'last',
  //   ],
  //   'space-before-blocks': 'error',
  //   'space-before-function-paren': [
  //     'error',
  //     {
  //       anonymous: 'never',
  //       named: 'never',
  //       asyncArrow: 'always',
  //     },
  //   ],
  //   'space-in-parens': [
  //     'error',
  //     'never',
  //   ],
  //   'space-unary-ops': 'error',
  //   'spaced-comment': [
  //     'error',
  //     'always',
  //     {
  //       exceptions: [
  //         '-+',
  //       ],
  //     },
  //   ],
  //   'switch-colon-spacing': 'error',
  //   'arrow-spacing': [
  //     'error',
  //     {
  //       before: true,
  //       after: true,
  //     },
  //   ],
  //   'generator-star-spacing': [
  //     'error',
  //     {
  //       before: false,
  //       after: true,
  //       anonymous: 'neither',
  //       method: {
  //         before: true,
  //         after: true,
  //       },
  //     },
  //   ],
  //   'no-duplicate-imports': 'error',
  //   'no-useless-computed-key': 'error',
  //   'no-useless-rename': 'error',
  //   'no-var': 'error',
  //   'rest-spread-spacing': [
  //     'error',
  //     'never',
  //   ],
  //   'template-curly-spacing': [
  //     'error',
  //     'never',
  //   ],
  //   'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
  //   'prefer-const': ['error', {
  //     destructuring: 'any',
  //     ignoreReadBeforeAssign: false,
  //   }],
  //   'dot-notation': 'error',
  //   'object-shorthand': 'error',
  //   '@typescript-eslint/no-var-requires': 'off',
  // },
  // overrides: [
  // ],
};
