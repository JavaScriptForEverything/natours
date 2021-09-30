import { toCapitalize, shorter } from '../../util'
import { Link, useHistory } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
// import Avatar from '@material-ui/core/Avatar'
// import Divider from '@material-ui/core/Divider'

import { makeStyles } from '@material-ui/core'

import MoreVertIcon from '@material-ui/icons/MoreVert'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import FlagIcon from '@material-ui/icons/Flag'
import PersonIcon from '@material-ui/icons/Person'


const useStyles = makeStyles( theme => ({
	alignIcon: {
		display: 'flex',
		alignItems: 'center'
	}
}))


const CardComponent = ({ tour }) => {
	const classes = useStyles()
	const history = useHistory()

	// console.log( tour.name, tour._id )

	return(
		<Card>
			<CardHeader
				// avatar={<Avatar />}
				title={toCapitalize(tour.name) }
				subheader={tour.summary}
				action={
					<IconButton aria-label='settings'>
						<MoreVertIcon />
					</IconButton>
				}
			/>
			<CardActionArea
				onClick = {() => history.push(`tour/${tour.slug}`)}
			>
				<CardMedia
					component='img'
					title={`/tour/${tour.slug}`}
					src={`/tours/${tour.imageCover}`}
					alt={`/tours/${tour.imageCover}`}
				/>
			</CardActionArea>
			<CardContent>
				{/*<Typography align='right'> Tour name </Typography>*/}
				<Typography variant='button'paragraph  color='primary'>
					{tour.difficulty} {tour.duration}-days Tour
				</Typography>

				<Typography paragraph align='justify' variant='body1' color='textSecondary' >
					{shorter(tour.description)}
				</Typography>

{/*					<Grid container alignItems='center'>
					<Grid item>
						<LocationOnIcon />
					</Grid>
					<Grid item>
						<Typography>location 1 </Typography>
					</Grid>
				</Grid>

				<Grid container direction='row' alignItems='center'>
						<LocationOnIcon /> <Typography>location 2</Typography>
				</Grid>

				<Grid style={{ display: 'flex' }}>
						<LocationOnIcon /> <Typography>location 3</Typography>
				</Grid>

				<Box display='flex' >
						<LocationOnIcon /> <Typography>location 4</Typography>
				</Box>
*/}

				<Grid container spacing={4}>
					<Grid item xs={6} className={classes.alignIcon}>
						<LocationOnIcon color='primary'/>
						<Typography>{tour.startLocation.description}</Typography>
					</Grid>
					<Grid item xs={6} className={classes.alignIcon}>
						<CalendarTodayIcon color='primary' />
						<Typography> {
							new Date(tour.startDates[0]).toLocaleString('en-US', {
								month: 'long',
								year: 'numeric'
							})
						} </Typography>
					</Grid>
				</Grid>

				<Grid container spacing={4} >
					<Grid item xs={6} className={classes.alignIcon}>
						<FlagIcon color='primary' />
						<Typography>{tour.startDates.length} Stops </Typography>
					</Grid>
					<Grid item xs={6} className={classes.alignIcon}>
						<PersonIcon color='primary' />
						<Typography> {tour.guides.length} people </Typography>
					</Grid>
				</Grid>

				<Box mt={4} >
					<Grid>
						<Typography component='span' variant='h5' color='primary'> ${tour.price} </Typography>
						<Typography component='span'> per person </Typography>
					</Grid>

					<Grid>
						<Typography component='span' variant='h5'> {tour.ratingsAverage.toFixed(1)} </Typography>
						<Typography component='span'> Ratings ({tour.ratingsQuantity} reviews) </Typography>
					</Grid>
				</Box>
			</CardContent>

			<CardActions>
				<Grid container justifyContent='flex-end'>
					<Button
						variant='contained'
						color='secondary'
						component={Link}
						to={`tour/${tour.slug}`}
					> Details </Button>
				</Grid>
			</CardActions>
		</Card>
	)
}

export default CardComponent
