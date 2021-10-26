import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showAlert } from '../store/dialogReducer'
import { addItemToCart } from '../store/tourReducer'

import { tour } from './home'
import MetaData from '../components/metaData'

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Rating from '@mui/material/Rating'
import Divider from '@mui/material/Divider'

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'




const TourDetails = () => {
	const [ cartItem, setCartItem ] = useState(1) 	// To increase or decrease item number
	const dispatch = useDispatch()
	const { addToCart } = useSelector( state => state.tour )
		// console.log( cartItem )

	const addHandler = (evt) => {
		if( cartItem >= tour.stack ) return
		setCartItem(cartItem + 1)
	}
	const removeHandler = (evt) => {
		if( cartItem <= 0 ) return
		setCartItem(cartItem - 1)
	}

	const addToCartHandler = (evt) => {
		const foundYou = addToCart.find(cart => cart._id === tour._id)

		if( !foundYou ) {
			let message = `'${tour.name}' added to cart`
			dispatch(showAlert({ open: true, severity: 'success', message }))

			dispatch(addItemToCart({ ...tour, orderQuantity: cartItem}))

		} else {
			let message = 'This product already added to Cart.'
			dispatch(showAlert({ open: true, severity: 'info', message }))
		}

	}


	return (
		<>
			<MetaData title='tour.name: Tour Details Page' />


				<Grid container spacing={2} sx={{ display: 'flex', my: 3, p: 2 }} >
					<Grid item xs={12} sm={6} >
						<Paper sx={{ p: 2 }}>
							<img src="/cover.jpg" alt="" width='100%' />
						</Paper>
					</Grid>

					<Grid item xs={12} sm={6} >
						<Paper sx={{ p: 2}}>
							<Typography component='section' color='textSecondary' >
								<Typography variant='h6' color='textPrimary' sx={{ textTransform: 'capitalize'}}> {tour.name} </Typography>
								<Typography variant='caption' paragraph > tour: {tour._id} </Typography>

								<Typography variant='h6' paragraph >
									<Rating readOnly defaultValue={tour.rating} precision={.5} />
									( {tour.reviews.length} Reviews )
								</Typography>
								<Typography variant='h6' paragraph color='textPrimary' > $ {tour.price.toFixed(2)} </Typography>
							</Typography>

							<Typography paragraph >
								<IconButton onClick={removeHandler}> <RemoveIcon color='error' /> </IconButton>
								<Typography component='span' sx={{ mx: 1 }} > {cartItem} </Typography>
								<IconButton onClick={addHandler}> <AddIcon color='success' /> </IconButton>
								<Button variant='contained' sx={{mx: 3, textTransform: 'Capitalize'}} onClick={addToCartHandler} >AddToCart</Button>
							</Typography>

							<Typography component='section' color='textSecondary' >
								<Typography paragraph>
									<Typography component='span' paragraph> Status: </Typography>
									<Typography component='span' paragraph > InStock </Typography>
								</Typography>
							</Typography>
							<Divider />

							<Typography component='section' color='textSecondary' sx={{ my: 2 }} >
								<Typography paragraph align='justify'> {tour.description} </Typography>
							</Typography>
							<Divider />

						</Paper>
					</Grid>
				</Grid>



		</>
	)
}
export default TourDetails
