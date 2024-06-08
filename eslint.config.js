import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    // TODO: temporary disable
    markdown: false,
  },
  // TODO: following configs not working
  {
    name: 'ni',
    files: ['./pages/posts/ni.md'],
    rules: {
      'no-useless-return': 'off',
      'unicorn/prefer-number-properties': 'off',
      'prefer-const': 'off',
      'no-console': 'off',
    },
  },
  {
    name: 'Koa',
    files: ['./pages/posts/Koa.md'],
    rules: {
      'unicorn/prefer-node-protocol': 'off',
      'node/handle-callback-err': 'off',
      'jsdoc/check-types': 'off',
    },
  },
)
