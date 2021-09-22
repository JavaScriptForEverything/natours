import { useEffect } from 'react'
import Helmet from '../components/helmet'
import Card from '../components/home/card'

import { getAllTours } from '../store/tourReducer'
import { useDispatch, useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'


const Home = () => {
	console.clear() 			// remove any errors on page load
	const dispatch = useDispatch()
	const { tours } = useSelector( state => state.tours )

	useEffect(() => {
		dispatch( getAllTours() )
	}, [dispatch])

	return(
		<>
			<Helmet title='Home Page' />

		{/*Problem-1: if add spacing then horizontal scrolbar applied */}
			<Grid container spacing={3}>
				{tours && tours.map( (tour, key) => (
					<Grid item key={key} xs={12} sm={6} md={3}>
						<Card tour={tour}/>
					</Grid>
				))}
			</Grid>

		</>
	)
}

export default Home
