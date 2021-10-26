import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showLoader } from '../store/dialogReducer'


import MetaData from '../components/metaData'
import HomeFilter from '../layout/homeFilter'
import Tour from '../components/tour'

import Grid from '@mui/material/Grid'
import Pagination from '@mui/material/Pagination'


export const tour = {
	_id: 'abcd76544ba876900eff',
	name: 'The see explorer',
	slug: 'The-see-explorer',
	summary: 'summary page description',
	description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. `,
	imageCover: 'cover.jpg',
	duration: 5,
	startLocation: {
		description: 'description'
	},
	startDates: [
		"2021-10-19T07:38:12.722Z"
	],
	guides: ['admin', 'user'],
	price: 424,
	orderQuantity: 4,
	rating: 4.3,
	ratingsAverage: 4,
	ratingsQuantity: 5,
	reviews: [2, 3, 4, 4, 4],
	stack: 4,
}


const Home = () => {
	const [ page, setPage ] = useState(1)
	const dispatch = useDispatch()
	const { loader } = useSelector(state => state.dialog)

	// // --------- If need to show loader then un-comment useEffect. that's it -------------
	// useEffect(() => {
	// 	dispatch(showLoader(true)) 												// show loader
	// 	setTimeout( () => dispatch(showLoader()), 200) 	// close loader ater 1 sec
	// }, [dispatch])



	return loader || (
		<>
			{/*add filter selction in left*/}
			<HomeFilter />


			<Grid container spacing={2} sx={{ my: 3, px: 2 }} >
				<MetaData title='Home Page' />

				{/*-----[ items ]-----*/}
				{[...Array(12)].map( (item, index) => (
					<Grid key={index} item xs={12} sm={6} md={4} >
						<Tour tour={tour} />
					</Grid>
				))}
			</Grid>


		{/*Add pagination	*/}
	    <Pagination
	    	sx={{ display: 'flex', justifyContent: 'center', my: 3 }}
	      variant='outlined'
	      color='primary'
	      count={11}
	      page={page}
	      onChange={(evt, newValue) => setPage(newValue)}
	      hidePrevButton
	      hideNextButton
	      boundaryCount={1}
	      siblingCount={1}
	    />

		</>
	)
}
export default Home
