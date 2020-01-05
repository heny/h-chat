const config = {
  mode: 'origin',
  server: {
    local: '10.105.19.124:8888',
    origin: 'chart-server.heny.vip'
  },
  getCurrentServer:function(){
    let isProduction = process.env.NODE_ENV === 'production'
    return isProduction ? this.server['origin'] : this.server[this.mode]
  }
}
export default config
