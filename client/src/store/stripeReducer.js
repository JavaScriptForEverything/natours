import { createSlice } from '@reduxjs/toolkit'
import { shippingObj, paymentObj } from '../stripe/data'


const { reducer, actions } = createSlice({
	name: 'stripe',
	initialState: {
		shippingObj : JSON.parse(localStorage.getItem('shipping')) || shippingObj ,
		detailsArr : JSON.parse(localStorage.getItem('addToCart')) || [],
		paymentObj : JSON.parse(localStorage.getItem('payment')) || paymentObj ,
	},
	reducers: {
		shippingAdded: (state, action) => {
			const shippingObj = action.payload
			localStorage.setItem('shipping', JSON.stringify(shippingObj))

			return { ...state, shippingObj }
		},
		paymentAdded: (state, action) => {
			const paymentObj = action.payload
			localStorage.setItem('payment', JSON.stringify(paymentObj))

			return { ...state, paymentObj }
		},
	}
})
export default reducer


export const addShippingInfo = (obj) => (dispatch) => {
	dispatch( actions.shippingAdded(obj))
}
export const addPaymentInfo = (obj) => (dispatch) => {
	dispatch( actions.paymentAdded(obj))
}
