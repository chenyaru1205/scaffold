const plugins = [
  // '@babel/plugin-transform-runtime', //  @defect 会导致子应用找不到
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-proposal-object-rest-spread',
  'transform-vue-jsx',
  [
    'component',
    {
      'libraryName': 'element-ui',
      'styleLibraryName': 'theme-chalk'
    }
  ]
]
if (process.env['NODE_ENV'] === 'development') {
  plugins.push('dynamic-import-node')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    ['@babel/preset-env',
      {
        'modules': false,
        'useBuiltIns': 'entry', // 根据浏览器版本的支持，将 polyfill 需求拆分引入，仅引入有浏览器不支持的polyfill
        'targets': {
          'browsers': ['> 1%', 'last 3 versions', 'not ie <= 8']
        }
      }]
  ],
  plugins
}
