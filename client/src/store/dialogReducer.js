import { createSlice } from '@reduxjs/toolkit'

const { reducer, actions } = createSlice({
	name: 'dialogs',
	initialState: {
		error: '',
		open: false,
		message: 'Something is wrong',
		severity: 'error',
	},
	reducers: {
		showAlert: (state, action) => ({
			...state,
			...action.payload 			// { open, message, severity }
		}),

	}
})
export default reducer


export const showAlert = ({ open=false, message='', severity='error' }) => (dispatch) => {
	dispatch( actions.showAlert({open, message, severity}))
}
