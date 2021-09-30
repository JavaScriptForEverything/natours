import { makeStyles } from '@material-ui/core'

import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles( theme => ({
	root: {
		marginTop: theme.spacing(5),
		backgroundColor: '#eee',
		// backgroundColor: theme.palette.background.primary
		padding: '2em 0'

	}
}))

const Footer = () => {
	const classes = useStyles()

	return(
		<footer className={classes.root} >
			<Typography
				align='center'
			> Copy right &copy; 2021 </Typography>
		</footer>
	)
}

export default Footer
