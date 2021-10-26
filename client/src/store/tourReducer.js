import { createSlice } from '@reduxjs/toolkit'

const { reducer, actions } = createSlice({
	name: 'products',
	initialState: {
		addToCart : JSON.parse(localStorage.getItem('addToCart')) || [],
	},
	reducers: {
		cartItemAdded: (state, action) => {
			const cartItems = state.addToCart.concat(action.payload)
			localStorage.setItem('addToCart', JSON.stringify(cartItems))

			return { ...state, addToCart: cartItems }
		},

		cartItemRemoved: (state, action) => {

			const filterItems = state.addToCart.filter( item => item._id !== action.payload._id )
			localStorage.setItem('addToCart', JSON.stringify(filterItems))

			return { ...state, addToCart: filterItems }
		}
	}
})
export default reducer


export const addItemToCart = (obj) => (dispatch) => {
	dispatch(actions.cartItemAdded(obj))
}

export const removeItemFromCart = (obj) => (dispatch) => {
	dispatch(actions.cartItemRemoved(obj))
}
