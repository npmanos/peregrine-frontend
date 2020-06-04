module.exports = {
  presets: [['@babel/preset-typescript', { jsxPragma: 'h' }]],
  plugins: [
    process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      '@babel/plugin-transform-react-jsx-source',
    ['const-enum', { transform: 'constObject' }], // for TS const enum which babel ts doesn't support natively. See https://github.com/babel/babel/issues/8741
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: true }],
    ['@babel/plugin-proposal-optional-chaining', { loose: true }],
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/transform-react-jsx',
      {
        pragma: 'h',
        useBuiltIns: true, // object.assign instead of _extends
      },
    ],
    '@babel/plugin-proposal-numeric-separator',
    // Removes the import of 'preact/debug'
    process.env.NODE_ENV === 'production' &&
      './babel-plugin-remove-preact-debug',
    'babel-plugin-transform-inline-environment-variables',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '^@/(.*)': './src/\\1',
        },
      },
    ],
    'babel-plugin-minify-dead-code-elimination',
  ].filter(Boolean),
}
