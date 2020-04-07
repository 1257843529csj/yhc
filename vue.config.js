module.exports = {
   lintOnSave: false,
   publicPath:'',
   devServer: {
    proxy: {
      "/c2": {
        target:"http://m23.filmfly.cn", //对应自己的接口
        changeOrigin: true,
        "secure": false,
        ws: true,
         pathRewrite: {
          "^/c2":'/c2'
        }
      }
    }
  }
}