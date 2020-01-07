import * as types from '../types'
const initialState = {
  showLoading: false,
  info: 'Loading...',
  status: 'loading'
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_LOADING_STATUS: return {
      ...state,
      showLoading: action.flag
    }
    case types.SET_INFO: return {
      ...state,
      info: action.message
    }
    case types.SET_STATUS: return {
      ...state,
      status: action.status
    }
    default: return state
  }
}
export default reducer
