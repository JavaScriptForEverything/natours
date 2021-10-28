import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { catchAsyncDispatch } from '../util'


/* There are 2 ways to get tourId on tourDetails page, where slug used on url instead of ID
			1. Create extra route on backend to getTourBySlug 	(Not a good one, actually we dit by name for search)
			2. Store tour._id on localStorate when click button to get tour details page,
					this way tourDetails.js can get tour by id to fetch data from backend by _id instead of slug
*/

const { reducer, actions } = createSlice({
	name: 'tours',
	initialState: {
		addToCart : JSON.parse(localStorage.getItem('addToCart')) || [],
		error: '',
		loading: false,
		tours: {}, 							// res.status(200).json({ ..., tours: [] })
		// tourId: '', 					// Set tourId, on localStorage, so that we can getTourBySlug
		tour: {
			price: 0,
			ratingsAverage: 0,
			reviews: [],
		},
	},
	reducers: {
		requested: (state, action) => ({
			...state, loading: true, error: ''
		}),
		failed: (state, action) => ({
			...state, loading: false, error: action.payload
		}),

		cartItemAdded: (state, action) => {
			const cartItems = state.addToCart.concat(action.payload)
			localStorage.setItem('addToCart', JSON.stringify(cartItems))

			return { ...state, addToCart: cartItems }
		},
		cartItemRemoved: (state, action) => {
			const filterItems = state.addToCart.filter( item => item._id !== action.payload._id )
			localStorage.setItem('addToCart', JSON.stringify(filterItems))

			return { ...state, addToCart: filterItems }
		},
		ratingAdded: (state, action) => ({
			...state, ratingsAverage: action.payload
		}),

		toursAdded: (state, action) => ({
			...state, loading: false, tours: action.payload
		}),
		tourDetailsAdded: (state, action) => ({
			...state, loading: false, tour: action.payload
		}),


	} // End reducers
})
export default reducer


export const addItemToCart = (obj) => (dispatch) => {
	dispatch(actions.cartItemAdded(obj))
}
export const removeItemFromCart = (obj) => (dispatch) => {
	dispatch(actions.cartItemRemoved(obj))
}
export const addRating = (rating) => (dispatch) => {
	dispatch(actions.ratingAdded(rating))
}


// export const getTours = () => async (dispatch) => {
// 	try {
// 		dispatch(actions.requested())

// 		const { data } = await axios.get('/api/tours')
// 		dispatch(actions.toursAdded({ ...data }))

// 	} catch (err) {
// 		dispatch(actions.failed(err.response.data.message))
// 	}
// }

export const getTourBySlug = (slug) => catchAsyncDispatch(async (dispatch) => {
	dispatch(actions.requested())

	const { data } = await axios.get(`/api/tours/tour/${slug}`)
	dispatch(actions.tourDetailsAdded(data.tour))
}, actions.failed)

export const getTours = (obj) => catchAsyncDispatch(async (dispatch) => {
	const {
		page = 1,
		limit = 3,
		difficulty = '',
		// location = '',
		duration = '',
		price = '',
		ratingsAverage = '',
	} = obj

	// let url = `/api/tours?page=${page}&limit=${limit}`

	let url = `/api/tours?page=${page}`
	    url += `&limit=${limit}`

  if(difficulty) 			url += `&difficulty=${difficulty}`
  // if(location) 				url += `&location=${location}`
  if(duration) 				url += `&duration=${duration}`
  if(price) 					url += `&price=${price}`
  if(ratingsAverage) 	url += `&ratingsAverage=${ratingsAverage}`



	dispatch(actions.requested())
	const { data } = await axios.get(url)
	dispatch(actions.toursAdded({ ...data }))
}, actions.failed)


