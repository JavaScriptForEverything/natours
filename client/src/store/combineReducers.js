import { combineReducers } from 'redux'
import tourReducer from './tourReducer'
import userReducer from './userReducer'
import dialogReducer from './dialogReducer'

const reducers = combineReducers({
	tours: tourReducer,
	users: userReducer,
	dialogs: dialogReducer,
})

export default reducers
