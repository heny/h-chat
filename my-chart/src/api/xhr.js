import axios from 'axios'

axios.defaults.baseURL = 'http://39.107.82.176:3006'

axios.interceptors.request.use(
  config => {
    return config
  },
  error => Promise.reject(error)
)
axios.interceptors.response.use(
  response => {
    return response
  },
  error => Promise.reject(error)
)

export const getData = (url,data,method='get') => {
  let config = {
    url,
    data,
    method: method.toLowerCase()
  }
  if(method.toLowerCase() === 'get') {
    config.params = data
  }
  return axios(config)
}
