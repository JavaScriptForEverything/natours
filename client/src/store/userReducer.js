import { createSlice } from '@reduxjs/toolkit'


const { reducer, actions } = createSlice({
	name: 'products',
	initialState: {
		error: '',
		loading: false,
		authenticated: !!localStorage.getItem('token') 	|| false
	},
	reducers: {
		requested: (state, action) => ({
			...state,
			loading: true,
		}),
		failed: (state, action) => ({
			...state,
			loading: false,
			error: action.payload
		}),

		logedIn: (state, action) => {
			const token = action.payload.token

			if(!token) return { ...state, loading: false }
			localStorage.setItem('token', token)

			return {
				...state,
				loading: action.payload.loading,
				authenticated: true,
				error: ''
			}
		},
		logedOut: (state, action) => {
			localStorage.removeItem('token')
			return {...state, loading: false, authenticated: false, }
		}


	} // End of Reducer
})
export default reducer



export const loginMe = (loading=false) => (dispatch) => {
	try{

	// this step must require to enable loading until not get data from API
	dispatch(actions.requested())

	// const { data } = await axios.post()
	const token = 'mysecretToken'
	dispatch(actions.logedIn({ token, loading }))


	} catch (err) {
		// dispatch(actions.failed(err.response.data.message))
		console.log(err)

	}
}

export const logoutMe = () => (dispatch) => {
	dispatch(actions.requested())
	dispatch(actions.logedOut())
}
