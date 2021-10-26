import { configureStore, combineReducers } from '@reduxjs/toolkit'

import tourReducer from './tourReducer'
import userReducer from './userReducer'
import dialogReducer from './dialogReducer'
import stripeReducer from './stripeReducer'


export default configureStore({
	reducer: combineReducers({
		tour: tourReducer,
		user: userReducer,
		dialog: dialogReducer,
		stripe: stripeReducer
	})
})
