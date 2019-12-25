const config = {
  mode: 'origin',
  server: {
    local: '10.105.19.124:8888',
    origin: '39.107.82.176:8888'
  },
  getCurrentServer:function(){
    let isProduction = process.env.NODE_ENV === 'production'
    return isProduction ? this.server['origin'] : this.server[this.mode]
  }
}
export default config
