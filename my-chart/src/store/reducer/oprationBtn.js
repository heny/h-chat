import * as types from '../types'
const initialState = {
  isCompressImg: true,
  isNoticeOnline: true
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_COMPREFF_IMG: return {
      ...state,
      isCompressImg: action.flag
    }
    case types.SET_NOTICE_ONLINE: return {
      ...state,
      isNoticeOnline: action.flag
    }
    default: return state
  }
}
export default reducer
