import { useEffect } from 'react'
import { getTourDetails } from '../store/tourReducer'
import { useDispatch, useSelector } from 'react-redux'


import { shorter, toCapitalize } from '../util'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'

import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

import { makeStyles } from '@material-ui/core'

import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import PersonIcon from '@material-ui/icons/Person'
import StarIcon from '@material-ui/icons/Star'

import Rating from '@material-ui/lab/Rating'


const useStyles = makeStyles( theme => ({
	leftBgColor: {
		// backgroundColor: theme.palette.primary.dard
		backgroundColor: '#eee'
	},
	quickFact: {
		marginBottom: theme.spacing(2)
	},
	titleMargin: {
		marginBottom: theme.spacing(4)
	},
	userMargin: {
		marginRight: theme.spacing(2)
	},
	horizontalFlex: {
		display: 'flex',
		overflowX: 'auto'
	}
}))



const TourDetails = ({ match }) => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const { tour } = useSelector( state => state.tours )

	// console.log( tour.startDates[1] instanceof Date )

	useEffect(() => {
		dispatch( getTourDetails(tour._id) )
	}, [dispatch, tour._id])

	return(
		<>
		<Grid container justifyContent='center' spacing={2} >
			<Card>
				<CardMedia
					component='img'
					title={`/tours/${tour.imageCover}`}
					src={`/tours/${tour.imageCover}`}
					alt={`/tours/${tour.imageCover}`}
				/>
			</Card>

			{/*-----[ Left Side ]-------*/}
			<Grid item xs={12} md={6} container className={classes.leftBgColor} >

				{/*item 1*/}
				<Grid item container direction='column' className={classes.quickFact} >
					<Typography variant='h4' color='primary'> Quick Facts </Typography>
				</Grid>

				{/*item 2: children as item 1*/}
				<Grid item container direction='row' className={classes.titleMargin}>
					<Grid item xs={12} md={4} >
						<Typography>
							<Typography component='span'><CalendarTodayIcon  color='primary'/> Next Date</Typography>
							<Typography component='span' color='textSecondary'> : {
								new Date(tour.startDates[1]).toLocaleString('en-US', {
									month: 'long',
									year: 'numeric'
								})
							}</Typography>
						</Typography>

						<Typography>
							<Typography component='span'><TrendingUpIcon  color='primary'/> Difficulty</Typography>
							<Typography component='span' color='textSecondary'> : {tour.difficulty.replace(/./, c => c.toUpperCase() )}</Typography>
						</Typography>

						<Typography>
							<Typography component='span'><PersonIcon color='primary'/> Participants</Typography>
							<Typography component='span' color='textSecondary'> : {tour.guides.length} People</Typography>
						</Typography>

						<Typography>
							<Typography component='span'><StarIcon color='primary'/> Rating: </Typography>
							<Typography component='span' color='textSecondary'>
							{tour.ratingsAverage} / 5
							</Typography>
						</Typography>
					</Grid>
				</Grid>


				{/*item 3: Heading for item 2*/}
				<Grid item container direction='column'>
					<Typography variant='h4' color='primary' paragraph >Your Tour Guides</Typography>
				</Grid>

				{/*item 2: children as item 1*/}
				<Grid item container direction='row' spacing={2} className={classes.titleMargin}>

					{tour.guides.map( (user, index) => (
						<Grid key={index} item xs={12} container alignItems='center' >
							<Avatar
								title={`/users/${user.photo}`}
								src={`/users/${user.photo}`}
								alt={`/users/${user.photo}`}
							/>
							<Typography component='span' style={{ marginLeft: '1em' }}> {user.role} - </Typography>
							<Typography component='span' color='textSecondary' style={{ marginLeft: '1em' }}>{user.name}</Typography>
						</Grid>
					))}

				</Grid>
			</Grid>

			{/*-----[ Right Side ]-------*/}
			<Grid item xs={12} md={6} >
				<Typography variant='h5' color='primary' align='center' paragraph > {`About ${tour.name} Tour`.toUpperCase()} </Typography>
				<Typography color='textSecondary' align='justify'> {tour.description} </Typography>
			</Grid>
		</Grid>



		{/*---------[ Gallery Section ]----------*/}
		<Grid container >
			{tour.images.map( (image, key) => (
			<Grid key={key} item md={4} >
				<CardMedia
					component='img'
					title={`/tours/${image}`}
					src={`/tours/${image}`}
					alt={`/tours/${image}`}
				/>
			</Grid>
			))}
		</Grid>

		{/*---------[ map Section ]----------*/}

		{/*---------[ Review Section ]----------*/}
		<Grid container >

		{tour.reviews.map( (review, key) => (
			<Box key={key} my={2}>

		<Container maxWidth='xs'>
		<Card>
			<CardHeader
				avatar={<Avatar
					title={`/users/${review.user.photo}`}
					src={`/users/${review.user.photo}`}
					alt={`/users/${review.user.photo}`}
					/>}
				title={toCapitalize(review.user.name)}
				subheader={
					<Rating
						name='review'
						defaultValue={review.rating}
						precision={.2}
						readOnly
					/>
				}
				// subheader='Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit '
				action={'x'}
			/>
			<CardContent>
				<Typography>
				{shorter(review.review, 150)}
				</Typography>
			</CardContent>
		</Card>
		</Container>
			</Box>
		))}
		</Grid>


		</>
	)
}

export default TourDetails
