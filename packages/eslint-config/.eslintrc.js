module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'prettier/standard',
    'prettier/react',
    'plugin:react-hooks/recommended',
    '@react-native-community'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'react-native/no-inline-styles': 'off',
    'prettier/prettier': 'error',
    'no-use-before-define': 'off',
    'no-extra-semi': 'off',
    camelcase: 'off',
    'react/prop-types': 'off',
    'no-useless-constructor': 'off',
    'space-before-function-paren': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': ['warn'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I']
      }
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ]
  },
  settings: {
    'import/resolver': {
      typescript: {}
    },
    react: {
      version: 'detect'
    }
  }
}
