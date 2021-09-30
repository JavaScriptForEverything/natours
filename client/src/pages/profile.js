import { useState } from 'react'
import { useSelector } from 'react-redux'

import { toCapitalize } from '../util'
import Helmet from '../components/helmet'
import UpdatePassword from '../components/dialogs/updatePassword'

import Grid from '@material-ui/core/Grid'
import CardMedia from '@material-ui/core/CardMedia'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles( theme => ({
	avatar: {
		width: 256,
		height: 256,
		marginTop: theme.spacing(-15),
		marginLeft: theme.spacing(5),
	}
}))



const Profile = () => {
	const classes = useStyles()
	const { user } = useSelector( state => state.users )
	const userNum = user ?  user.photo.split('-').pop().split('.').shift() : 1

	const [ open, setOpen ] = useState(false)

	return (
		<>
			<Helmet title='Profile Page' />
			<Grid container >
				<Grid item xs={12} >
					<CardMedia
						component='img'
						src={`/tours/tour-${userNum}-cover.jpg`}
						title={`/tours/tour-${userNum}-cover.jpg`}
						alt={`/tours/tour-${userNum}-cover.jpg`}
						height='240px'
					/>
				</Grid>

				<Grid item xs={12} sm={6} >
					<Avatar
						src={`/users/${user.photo}`}
						title={`/users/${user.photo}`}
						alt={`/users/${user.photo}`}
						className={classes.avatar}
					/>
				</Grid>
				<Grid item xs={12} sm={6} >
					<Typography> Name: {toCapitalize(user.name)} </Typography>
					<Typography> Role: {toCapitalize(user.role)} </Typography>
					<Typography> Email: {user.email} </Typography>
				</Grid>
			</Grid>

			<Grid container >
				<Grid item xs={12} >
					<Typography>
						Update user Name, Email, photo... :
						<Button
							variant='outlined'
							color='primary'
							size='small'
							onClick={() => setOpen(true) }
						>Update</Button>
						<UpdatePassword open={open} onClose={() => setOpen(false)} />
					</Typography>
				</Grid>

				<Grid item xs={12} >
					<Typography>
						Update user Password : <Button variant='outlined'color='primary'size='small'>Update</Button>
					</Typography>
				</Grid>
			</Grid>


		</>
	)
}
export default Profile
