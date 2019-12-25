import axios from 'axios'
import config from '../config'

axios.defaults.baseURL = config.getCurrentServer()

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
