import { combineReducers } from 'redux'

import boxReducer from './boxReducer'

const counterApp = combineReducers({
  boxReducer
})

export default counterApp
