import { combineReducers } from 'redux'
import toast from './toast'
import oprationBtn from './oprationBtn'
import upload from './upload'
const rootReducer = combineReducers({
  toast,
  oprationBtn,
  upload
})
export default rootReducer
