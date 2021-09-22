import Helmet from '../components/helmet'

import Grid from '@material-ui/core/Grid'
// import Paper from '@material-ui/core/Paper'
// import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

// import { makeStyles } from '@material-ui/core'
// const useStyles = makeStyles( theme => ({}))

const Profile = () => {
	console.log('Protected route')

	return (
		<>
			<Helmet title='Profile Page' />
			<Grid container justifyContent='center' >
				<Grid item >
					<Typography> Item 1 </Typography>
					<Typography> Item 2 </Typography>
				</Grid>
			</Grid>
		</>
	)
}
export default Profile
