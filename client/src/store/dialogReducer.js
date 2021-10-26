import { createSlice } from '@reduxjs/toolkit'


const { reducer, actions } = createSlice({
	name: 'products',
	initialState: {
		open : false,
		severity: 'info',
		message: '',
		loader: false
	},
	reducers: {
		alert: (state, action) => ({
			...state,
			...action.payload
		}),
		loader: (state, action) => ({
			...state, loader: action.payload
		})
	}
})
export default reducer



export const showAlert = ({open=false, severity='info', message=''}) => (dispatch) => {
	dispatch(actions.alert({ open, severity, message}))
}

export const showLoader = (open=false) => (dispatch) => {
	dispatch( actions.loader(open))
}
