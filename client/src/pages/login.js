import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isEmail } from 'validator'

import { createInputItem } from '../util'
import Helmet from '../components/helmet'
import { login, getMe } from '../store/userReducer'
import { showAlert } from '../store/dialogReducer'
import { useDispatch, useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import CircularProgress from '@material-ui/core/CircularProgress'

import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

const useStyles = makeStyles( theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '2em 0',
	},
	avatar : {
		backgroundColor: theme.palette.secondary.main,
		margin: '1em 0'
	},
	form: {
		width: '90%'
	},
	container: {
		margin: '4em auto' 		// if set 0 instead of auto, then container sit into left side
	},
	loginButton: {
		marginBottom: '1em'
	}
}))


const inputItems = [
	// { label: 'Email Address', type: 'email', name:'email' },
	// { label: 'Password', type: 'password', name:'password' },
	createInputItem('Email Address', 'email', 'email'),
	createInputItem('Password', 'password', 'password'),
]
const fieldItems = {} 					// { email: '', password: '' }
inputItems.forEach( field => fieldItems[field.name] = '' )



const Login = ({ history }) => {
	const classes = useStyles()
	const [fields, setFields ] = useState(fieldItems)
	const [fieldErrors, setFieldErrors ] = useState(fieldItems)

	const dispatch = useDispatch()
	const { loading, error, authenticated } = useSelector( state => state.users )


	const validate = () => {
		const errors = {}
		// Object.keys(fields).forEach(field => {
		// 	if( !fields[field].trim() )  errors[field] = `${field} field is empty`
		// })
		Object.keys(fields).forEach(field => !fields[field].trim() && (errors[field] = `${field} field is empty`) )
		if( !isEmail(fields.email) ) errors.email = 'Invalid Email address'

		setFieldErrors(errors) 	// set Errors

		// if every field empty only then return true else return false
		return Object.values( errors ).every( field => field === '')
	}


	const changeHandler = (evt) => {
		setFields({ ...fields, [evt.target.name]: evt.target.value })
		validate( fields )
	}

	const handleFormSubmit = (evt) => {
		evt.preventDefault()

		if( !validate( fields ) ) return 		// if no error then move on
		dispatch( login(fields) ) 					// add cookie if success


		// handle error first
		// console.log( {error} )
		// if(error.trim()) return dispatch( showAlert({ open: true, error, severity: 'error' }) )


		// set notification + loader
		const message = 'Congratuation you are successfully loged in !!!'
		dispatch( showAlert({ open: true, message, severity: 'success' }) )
		dispatch( getMe() ) 								// must required to got user immediately after login
		// no need to push, because By default login route push to /profile if authenticated
	}

	return(
		<Container maxWidth='xs' className={classes.container} >
		<Helmet title='Login Page' />

			<Grid container>
				<Grid item >

					<Paper className={classes.root} >
						<Typography variant='h4' color='textSecondary'>Login</Typography>
						<Avatar className={classes.avatar} > <LockOutlinedIcon /> </Avatar>
						<form className={classes.form} noValidate onSubmit={handleFormSubmit} >
							{inputItems.map( ({label, type, name}, key) => <TextField key={key}
									label={label}
									variant='outlined'
									InputLabelProps={{ shrink: true }}
									color='primary'
									type={type}
									name={name}
									value={fields[name]}
									onChange={changeHandler}
									// onChange={(evt) => setFields({...fields, [evt.target.name]: evt.target.value })}
									fullWidth
									required
									autoFocus={key === 0}
									// autoComplete='new-password'

									error={!!fieldErrors[name]}
									helperText={fieldErrors[name]}
									style={{ marginBottom: '24px' }}
								/>
							)}

							<Button
								variant='contained'
								color='primary'
								fullWidth
								type='submit'
								className={classes.loginButton}
							>
								{ loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Login' }
							</Button>

							<Grid container justifyContent='space-between'>
								<Typography variant='body2' color='primary' component={Link} to='/forgot-password'>Forgot password?</Typography>
								<Typography variant='body2' color='primary' component={Link} to='/signup'>Don't have an account? Sign Up</Typography>

{/*								<Grid item xs={6}>
									<Typography variant='body2' color='primary' component={Link} to='#'>Forgot password?</Typography>
								</Grid>

								<Grid item xs={6}>
									<Typography variant='body2' color='primary' component={Link} to='#'>Don't have an account? Sign Up</Typography>
								</Grid>
*/}
							</Grid>
						</form>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	)
}

export default Login
