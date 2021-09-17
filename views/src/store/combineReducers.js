import { combineReducers } from 'redux'
import tourReducer from './tourReducer'
import userReducer from './userReducer'

const reducers = combineReducers({
	tours: tourReducer,
	users: userReducer,
})

export default reducers
