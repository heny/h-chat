const config = {
  mode: process.env.NODE_ENV === 'production' ? 'origin' : 'local',
  server: {
    local: '10.105.19.124:8888',
    origin: '39.107.82.176:8888'
  }
}
export default config
