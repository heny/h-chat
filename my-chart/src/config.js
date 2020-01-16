const config = {
<<<<<<< HEAD
  mode: 'company',
  server: {
    company: 'http://10.105.19.124:8008/', // 公司的ip地址
    home: 'http://192.168.1.110:8888/', // 家里的ip地址
=======
  mode: 'home',
  server: {
    company: 'http://10.105.19.124:8888/', // 公司的ip地址
    home: 'http://192.168.1.107:8888/', // 家里的ip地址
>>>>>>> ad139508ebfd915801f615d87b48ab9e74c14609
    origin: 'https://chart-server.heny.vip/' // 服务器的ip地址
  },
  getCurrentServer: function () {
    let isProduction = process.env.NODE_ENV === 'production'
    return isProduction ? this.server['origin'] : this.server[this.mode]
  }
}
export default config
