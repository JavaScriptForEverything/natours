import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { catchAsyncDispatch } from '../util'

const { reducer, actions } = createSlice({
	name: 'users',
	initialState: {
		loading: false,
		error: '',
		authenticated: false,
		data: {}, 							// { status: 'success', user: {...} }
		user: { 								// 	/api/users/me
			name: '',
			email: '',
			photo: '',
			role: ''
		},
		data: { 								// /api/users/forgot-password
			message: '',
			resetToken: ''
		}
	},
	reducers : {
		error: (state, action) => ({
			...state, loading: false, error: action.payload
		}),
		requested: (state, action) => ({
			...state, loading: true,
		}),


		logedIn: (state, action) => ({
			...state,
			loading: false,
			error: '',
			authenticated: true
		}),
		signedUp: (state, action) => ({
			...state,
			loading: false,
			error: '',
			data: action.payload
		}),
		me: (state, action) => ({
			...state,
			loading: false,
			error: '',
			authenticated: true,
			user: action.payload.data,
		}),
		logedOut: (state, action) => ({
			...state,
			loading: false,
			authenticated: false,
			user: state.user
		}),

		forgotPassword: (state, action) => ({
			...state,
			loading: false,
			data: action.payload
		}),

	}
})
export default reducer



// (1)
export const login = (obj) => catchAsyncDispatch(async (dispatch) => {
	dispatch( actions.requested() )

	await axios.post('/api/users/login', obj)
	dispatch( actions.logedIn() )

}, actions.error)

// (5)
export const signup = (obj) => catchAsyncDispatch(async (dispatch) => {
	dispatch( actions.requested() )

	const { data } = await axios.post('/api/users/signup', obj)
	dispatch( actions.signedUp(data) )

}, actions.error)




// (2)
export const getMe = () => catchAsyncDispatch(async (dispatch, getStore) => {
	/* if( !getStore().users.authenticated ) return
		This not works for page reload time, so se have to check if cookie exists or not

			if( !token ) return
	*/


	dispatch( actions.requested() )
	const { data } = await axios.get('/api/users/me')
	dispatch( actions.me(data) )

}, actions.error)



// (3) to logout we need 	/api/users/logout 	Route to remove cookie
export const logout = () => catchAsyncDispatch(async (dispatch) => {
	dispatch( actions.requested() )

	await axios.get('/api/users/logout') 				// requires to remove cookie
	dispatch( actions.logedOut() ) 							// requires to empty store.users.user

}, actions.error)



// (4)
export const getPassword = (obj) => catchAsyncDispatch(async (dispatch) => {
	dispatch( actions.requested() )

	const { data } = await axios.post('/api/users/forgot-password', obj) 				// requires to remove cookie
	dispatch( actions.forgotPassword(data) ) 							// requires to empty store.users.user

}, actions.error)

