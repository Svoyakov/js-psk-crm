module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json', '.ts'],
    },
  },
  runtimeCompiler: true,
  devServer: {
    disableHostCheck: true,
    port: 4000,
    public: '0.0.0.0:4000',
  },
}
