import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showLoader } from '../store/dialogReducer'
import { getTours } from '../store/tourReducer'

import MetaData from '../components/metaData'
import HomeFilter from '../layout/homeFilter'
import Tour from '../components/tour'

import Grid from '@mui/material/Grid'
import Pagination from '@mui/material/Pagination'


const Home = () => {
	const dispatch = useDispatch()
	const { loader } = useSelector(state => state.dialog)

	const { error, loading, tours } = useSelector( state => state.tour )

	// console.log({ error, loading, tours })

	const [ page, setPage ] = useState(1)
	const [ limit, setLimit ] = useState(3)
	const paginationCount = tours.totalDocument / limit 		// Show Number of pagi available


	useEffect(() => {
		dispatch(getTours({ page }))
	}, [dispatch, page])

	return (
		<>
			{/*add filter selction in left*/}
			<HomeFilter />


			<Grid container spacing={2} sx={{ my: 3, px: 2 }} >
				<MetaData title='Home Page' />

				{/*-----[ items ]-----*/}
				{/*{[...Array(12)].map( (item, index) => (*/}
				{tours.data?.map( (item, index) => (
					<Grid key={index} item xs={12} sm={6} md={4} >
						<Tour tour={item} />
					</Grid>
				))}
			</Grid>


		{/*Add pagination	*/}
	    <Pagination
	    	sx={{ display: 'flex', justifyContent: 'center', my: 3 }}
	      variant='outlined'
	      color='primary'
	      count={tours.totalDocument && paginationCount}
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
