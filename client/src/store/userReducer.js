import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { showAlert } from './dialogReducer'
import { catchAsyncDispatch } from '../util'


const { reducer, actions } = createSlice({
	name: 'products',
	initialState: {
		error: '', 								// Must need to empty error on every request
		loading: false, 					// Required to add loading features
		authenticated: !!localStorage.getItem('token') 	|| false, 	// Required to authenticate on clientSide
	},
	reducers: {
		requested: (state, action) => ({
			...state,
			loading: true,
			error: ''
		}),
		failed: (state, action) => ({
			...state,
			loading: false,
			error: action.payload || ''
		}),

		logedIn: (state, action) => {
			const { token } = action.payload

			if(!token) return { ...state, loading: false }
			localStorage.setItem('token', token)

			return { ...state, loading: false, authenticated: true }
		},
		logedOut: (state, action) => {
			localStorage.removeItem('token')
			return {...state, loading: false, authenticated: false, }
		},
		signedUp: (state, action) => ({ ...state, loading: false }),
		tokenSent: (state, action) => ({ ...state, loading: false }),
		getMe: (state, action) => ({
			...state,
			loading: false,
			// ...action.payload.data,   				// this `data` comes from backend, next time make it 'doc'
			user: action.payload.data 					// used as useSelector(state => state.user.user)
		}),
		profileUpdated: (state, action) => {

			return { ...state, loading: false }
		},
		passwordUpdated: (state, action) => {

			const { token } = action.payload

			if(!token) return { ...state, loading: false }
			localStorage.setItem('token', token)

			return { ...state, loading: false, authenticated: true }
		},


	} // End of Reducer
})
export default reducer



// export const loginMe = (obj) => async (dispatch, getStore) => {
// 	try{
// 	// this step must require to enable loading until not get data from API
// 	dispatch(actions.requested())

// 	const { data } = await axios.post(`/api/users/login`, obj)
// 	dispatch(actions.logedIn({ token: data.token }))

// 	} catch (err) {
// 		dispatch(actions.failed(err.response.data.message))
// 	}
// }

export const loginMe = (obj) => catchAsyncDispatch(async (dispatch, getStore) => {
	dispatch(actions.requested())

	const { data } = await axios.post(`/api/users/login`, obj)
	dispatch(actions.logedIn(data))
}, actions.failed)

export const logoutMe = () => (dispatch) => {
	dispatch(actions.requested())
	dispatch(actions.logedOut())
}

export const signUpMe = (obj) => catchAsyncDispatch(async (dispatch) => {
	dispatch(actions.requested())

	const { data } = await axios.post('/api/users/signup', obj)
	dispatch(actions.signedUp())
}, actions.failed)


export const forgotPassword = (obj) => catchAsyncDispatch(async (dispatch) => {
	dispatch(actions.requested())

	const { data } = await axios.post('/api/users/forgot-password', obj)
	console.log( data )

	const message = 'No token found'
	if( !data.resetToken ) return dispatch(showAlert({ open: true, severity: 'error', message}))

	dispatch(showAlert({ open: true, severity: 'success', message: data.message}))
	dispatch(actions.tokenSent())
}, actions.failed)

export const resetPassword = (obj) => catchAsyncDispatch(async (dispatch) => {
	dispatch(actions.requested())

	// we used patch request on Backend, to this route, don't know why ?
	// Perhapse 2 route matches same signeture.
	const { data } = await axios.patch(`/api/users/reset-password/${obj.token}`, obj)
	console.log( data )

	if( !data.token ) return dispatch(showAlert({ open: true, severity: 'error', message}))

	const message = 'Password reset successfully !!!'
	dispatch(showAlert({ open: true, severity: 'success', message}))
	dispatch(actions.tokenSent())
}, actions.failed)



/*Geting User but how ?
		. Because of 'cookie' which set on backend section, see authController.protect() */
export const getUser = () => catchAsyncDispatch(async (dispatch) => {
	dispatch(actions.requested())

	const { data } = await axios.get(`/api/users/me`)

	// console.log(data)

	dispatch(actions.getMe(data))
}, actions.failed)




// Need to fix it.
export const profileUpdate = (obj) => catchAsyncDispatch(async (dispatch) => {
	dispatch(actions.requested())

	// const { data } = await axios.patch(`/api/users/update-me`, obj)
	dispatch(actions.profileUpdated())
	return console.log('Next time fix it')

	// let message = 'Can\' update, something wrong on backend-side'
	// if( data.status !== 'success' ) return dispatch(showAlert({ open: true, severity: 'error', message}))

	// message = 'Profile updated successfully !!!'
	// dispatch(showAlert({open: true, severity: 'success', message}))

}, actions.failed)

export const updatePassword = (obj) => catchAsyncDispatch(async (dispatch) => {
	dispatch(actions.requested())

	const { data } = await axios.patch(`/api/users/update-my-password`, obj)
	// return console.log('Next time fix it')

	let message = 'No Token found after update user'
	if( !data.token ) return dispatch(showAlert({ open: true, severity: 'error', message}))

	message = 'Password updated successfully !!!'
	dispatch(showAlert({open: true, severity: 'success', message}))

	dispatch(actions.passwordUpdated(data))

}, actions.failed)







