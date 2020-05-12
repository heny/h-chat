import * as types from '../types'
const initialState = {
  hash: ''
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_HASH: return {
      ...state,
      hash: action.hash
    }
    default: return state
  }
}
export default reducer
