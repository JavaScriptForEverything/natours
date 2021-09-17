import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const { reducer, actions } = createSlice({
	name: 'tours',
	initialState: {
		tours: [], 			// set initial property, so that tours exist even though no dispatch happend yet.
		tour: {
			name: '',
			imageCover: '',
			images: [],
			startDates: [],
			difficulty: '',
			guides: [],
			ratingsAverage: '',
			description: '',
			reviews: []


		}, 			// else show error, tour is not defined.
	},
	reducers : {
		toursAdded: (state, action) => ({
			...state,
			tours: action.payload.data
		}),
		tourDetails: (state, action) => ({
			...state,
			tour: action.payload.data
		}),
	}
})
export default reducer


export const getAllTours = () => async(dispatch) => {
	try{
		const { data } = await axios.get('/api/tours')
		dispatch( actions.toursAdded(data) )

	} catch(err) {
		console.log(err)
	}
}

export const getTourDetails = (id='5c88fa8cf4afda39709c2951') => async(dispatch) => {
	try{
		const { data } = await axios.get(`/api/tours/${id}`)
		dispatch( actions.tourDetails(data) )

	} catch(err) {
		console.log(err)
	}
}
