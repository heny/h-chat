import * as types from '../types'
const initialState = {
  isCompressImg: true
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_COMPREFF_IMG: return {
      ...state,
      isCompressImg: action.flag
    }
    default: return state
  }
}
export default reducer
