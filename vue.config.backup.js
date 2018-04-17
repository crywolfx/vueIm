module.exports = {
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#配置代理
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3000/',
                changeOrigin: true,
                pathRewrite: {
                  '^/api': '/'
                }
              }
        }, // string | Object
        before: app => {
          // `app` 是一个 express 实例
        }
      }
}