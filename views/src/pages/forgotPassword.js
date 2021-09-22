/*
	- Make it stepper
		1. To get ResetToken
		2. Reset password based on Token
		3. Send to home page
*/


import { useState } from 'react'
// import { Link } from 'react-router-dom'
import { isEmail } from 'validator'

import Helmet from '../components/helmet'
import { getPassword } from '../store/userReducer'
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
}))


const inputItems = [{ label: 'Email Address', type: 'email', name:'email' }]
const fieldItems = {} 					// { email: '', password: '' }
inputItems.forEach( field => fieldItems[field.name] = '' )



const ForgotPassword = ({ history }) => {
	const classes = useStyles()
	const [fields, setFields ] = useState(fieldItems)
	const [fieldErrors, setFieldErrors ] = useState(fieldItems)

	const dispatch = useDispatch()
	const { loading, data } = useSelector( state => state.users )

	const validate = () => {
		const errors = {}
		Object.keys(fields).forEach(field => !fields[field].trim() && (errors[field] = `${field} field is empty`) )
		if( !isEmail(fields.email) ) errors.email = 'Invalid Email address'

		setFieldErrors(errors) 	// set Errors

		return Object.values( errors ).every( field => field === '')
	}


	const changeHandler = (evt) => {
		setFields({ ...fields, [evt.target.name]: evt.target.value })
		validate( fields )
	}

	const handleFormSubmit = (evt) => {
		evt.preventDefault()

		if( !validate( fields ) ) return
		dispatch( getPassword(fields) )

		// history.push('/profile')
	}
		console.log( data )

	return(
		<Container maxWidth='xs' className={classes.container} >
			<Helmet title='Forgot Password Page' />

			<Grid container>
				<Grid item >

					<Paper className={classes.root} >
						<Typography variant='h4' color='textSecondary'>Recover Password</Typography>
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
									fullWidth
									required
									autoFocus={key === 0}

									error={!!fieldErrors[name]}
									helperText={fieldErrors[name]}
									style={{ marginBottom: '24px' }}
								/>
							)}

							<Button variant='contained'color='primary'fullWidth type='submit'>
								{ loading ? <CircularProgress size={24}
								style={{ color: 'white' }} /> : 'Send Email' }
							</Button>
							<TextField margin='dense' style={{ visibility: 'hidden' }} />
						</form>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	)
}
export default ForgotPassword
