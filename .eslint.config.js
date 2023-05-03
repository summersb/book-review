// import * as reactRecommended from 'eslint-plugin-react/configs/recommended'
const reactRecommended = require('eslint-plugin-react/configs/recommended')

export default [
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules/**'],
    ...reactRecommended,
    languageOptions: {
      ...reactRecommended.languageOptions,
    },
    rules: {
      'import/order': [
        1,
        {
          pathGroups: [
            {
              pattern: '~/**',
              group: 'external',
              position: 'after',
            },
          ],
          groups: ['external', 'builtin', 'internal', 'sibling', 'parent', 'index'],
        },
      ],
    },
  },
  // {
  //   env: {
  //   browser: true,
  //     es2021: true
  // },
  //   extends: [
  //   plugin:react/recommended,
  //   standard-with-typescript,
  //   plugin:@typescript-eslint/recommended,
  //   react/jsx-runtime,
  //   prettier
  // ],
  //   parser: @typescript-eslint/parser,
  //   overrides: [
  // ],
  //   parserOptions: {
  //   project: [tsconfig.json],
  //     ecmaVersion: latest,
  //     sourceType: module
  // },
  //   plugins: [
  //   react,@typescript-eslint,prettier
  // ],
]
