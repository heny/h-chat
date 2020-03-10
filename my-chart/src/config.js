const config = {
  mode: 'origin',
  server: {
    company: 'http://10.105.19.124:8888/', // 公司的ip地址
    // home: 'http://192.168.1.107:8888/', // 家里的ip地址
    home: 'http://192.168.1.6:8888/', // 家里的ip地址
    origin: 'https://chart-server.heny.vip/' // 服务器的ip地址
  },
  getCurrentServer: function () {
    let isProduction = process.env.NODE_ENV === 'production'
    return isProduction ? this.server['origin'] : this.server[this.mode]
  }
}
export default config
