import { combineReducers } from 'redux'
import toast from './toast'
import oprationBtn from './oprationBtn'
const rootReducer = combineReducers({
  toast,
  oprationBtn
})
export default rootReducer
