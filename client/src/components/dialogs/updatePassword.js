import { useState } from 'react'
import { isEmail } from 'validator'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { createInputItem } from '../../util'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

import { makeStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

import CloseIcon from '@material-ui/icons/Close'


const useStyles = makeStyles( theme => ({}))

const inputItems = [
	createInputItem('Full Name', 'name'),
	createInputItem('Email Address', 'email', 'email'),
	createInputItem('User Avatar', 'photo', 'file'),
]
const fieldItems = {} 					// { email: '', password: '' }
inputItems.forEach( field => fieldItems[field.name] = '' )



const UpdatePassword = ({ open=false, onClose=f=>f }) => {
	const classes = useStyles()
	const { loading, error, user } = useSelector( state => state.users )

	const [fields, setFields ] = useState(fieldItems)
	const [fieldErrors, setFieldErrors ] = useState(fieldItems)



	const validate = () => {
		const errors = {}
		Object.keys(fields).forEach(field => !fields[field].trim() && (errors[field] = `${field} field is empty`) )
		if( !isEmail(fields.email) ) errors.email = 'Invalid Email address'
		setFieldErrors(errors) 	// set Errors

		return Object.values( errors ).every( field => field === '')
	}


	const changeHandler = (evt) => {
		validate( fields )
		setFields({ ...fields, [evt.target.name]: evt.target.value })
	}

	const handleFormSubmit = (evt) => {
		evt.preventDefault()

		if( !validate( fields ) ) return 		// if no error then move on

		// to send image name to backend, instead of ful file path
		let file = ''
		Object.values(evt.target).forEach(input => input.name === 'photo' && (file = input.files[0].name) )

		console.log( {...fields, photo: file} )
		// instead of modifing controlled variable, just pass data => axios => Backend
		// dispatch( signup({ ...fields, photo: file }) )

		// const message = 'Congratuation you are successfully Registered !!!'
		// dispatch( showAlert({ open: true, message, severity: 'success' }) )
		// history.push('/login')
	}


	return (
		<>
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>
				<Typography>Update User profile</Typography>
					<IconButton
						onClick={onClose}
						sx={{
	            position: 'absolute',
	            right: 8,
	            top: 8,
	            color: (theme) => theme.palette.grey[500],
          	}}
					>
						<CloseIcon />
					</IconButton>
				<DialogContent>
						<form
							// className={classes.form}
							noValidate
							onSubmit={handleFormSubmit}
						>
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
								{ loading ? <CircularProgress
									size={24} style={{ color: 'white' }} /> : 'Update' }
							</Button>

						</form>
				</DialogContent>
			</DialogTitle>

		</Dialog>
		</>
	)
}
export default UpdatePassword
