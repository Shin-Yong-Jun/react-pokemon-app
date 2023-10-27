module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    //추가로 끈 사항들, 사용안되는 변수에러 및 문법 관련
    "no-unused-vars": "off",
    "react/prop-types": "off",
    "react-hooks/exhaustive-deps": "off",
    //
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
      
    ],
  },
}
