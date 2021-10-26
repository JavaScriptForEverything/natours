import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { showAlert } from '../store/dialogReducer'
import { formValidator } from '../util'
import MetaData from '../components/metaData'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { TabPanel } from '../util'

import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'

import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'



const UserUpdate = ({ history }) => {
	const dispatch = useDispatch()
	const [ value, setValue ] = useState(0) 						// to set Tabs
	const [ currentPasswordVisibility, setCurrentPasswordVisibility ] = useState(1)
	const [ newPasswordVisibility, setNewPasswordVisibility ] = useState(1)
	const [ confirmPasswordVisibility, setConfirmPasswordVisibility ] = useState(1)

	// user details comes from database first
	// const [ fields, setFields ] = useState({username: '', email : '', avatar: ''})
	const user = {username: 'Riajul Islam', email: 'abc@gmail.com', avatar: '/user.jpg'}
	const [ fields, setFields ] = useState({...user })
	const [ fieldErrors, setFieldErrors ] = useState({})

	const [ updateFields, setUpdateFields ] = useState({currentPassword: '', password: '', confirmPassword: ''})
	const [ updateFieldErrors, setUpdateFieldErrors ] = useState({})

	const [ loading, setLoading ] = useState(false)



	const tabHandler = (evt, newValue) => setValue(newValue)

	// Update Profile Form Handler
	const profileFormHandler = (evt) => {
		evt.preventDefault()

		const isValidated = formValidator(fields, setFieldErrors)
		if(!isValidated) return

		// mimic loading effect
		setLoading(true)
		setTimeout(() => {
		setLoading(false)

		// Success message
		const message = 'Profile updated successfully !!!'
		dispatch(showAlert({open: true, severity: 'success', message}))

		// send data to backend, via axios
		console.log({fields})

		// redirect to
		history.push('/user/profile')
		// tabHandler(null, 0) 							// to switch to 1st tab (Update Profile)

		}, 2000)
	}



	const updateFieldsHandler = (evt) => {
		evt.preventDefault()

		const isValidated = formValidator(updateFields, setUpdateFieldErrors)
		if(!isValidated) return

		// mimic loading effect
		setLoading(true)
		setTimeout(() => {
		setLoading(false)

		// Success message
		const message = 'Current Password successfully !!!'
		dispatch(showAlert({open: true, severity: 'success', message}))

		// send data to backend, via axios
		console.log({updateFields})

		// redirect to
		history.push('/user/profile')

		}, 2000)
	}





	return (
		<Box sx={{ mt: 3, p: 3 }} >
			<MetaData title='Update Me' />
			<Container maxWidth='xs' component='main'  >
				<Paper sx={{ p: 2 }} >
					<Tabs value={value} onChange={tabHandler} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }} >
						<Tab label='Update Profile'  />
						<Tab label='Update Password' />
					</Tabs>

					{/*-----[ Update Profile Form ]-----*/}
					<TabPanel value={value} index={0} >
						<form noValidate onSubmit={profileFormHandler}>
							<TextField
								// sx={{ mt: 2 }}
								label='Full Name'
								type='text'
								fullWidth
								required
								InputProps={{
									startAdornment: <InputAdornment position='start'><PersonIcon /></InputAdornment>
								}}
								value={fields.username}
								onChange={(evt) => setFields({...fields, username: evt.target.value})}
								error={!fields.username || !!fieldErrors.username}
								helperText={fieldErrors.username}
							/>
							<TextField
								sx={{ mt: 2 }}
								label='Email Address'
								type='email'
								fullWidth
								required
								InputProps={{
									startAdornment: <InputAdornment position='start'><EmailIcon /></InputAdornment>
								}}
								value={fields.email}
								onChange={(evt) => setFields({...fields, email: evt.target.value})}
								error={!fields.email || !!fieldErrors.email}
								helperText={fieldErrors.email}
							/>

							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 2}} >
								<Avatar src={fields.avatar} />
								<TextField
									type='file'
									InputProps={{
										inputProps: { accept: 'image/*' }
									}}
									onChange={(evt) => {
										const file = evt.target.files[0]
										const image = file.type.match('image/*')
										const reader = new FileReader()
										image && reader.readAsDataURL(file)
										reader.onload = () => {
											(reader.readyState === 2) && setFields({ ...fields, avatar: reader.result })
										}
									}}
									error={!fields.avatar || !!fieldErrors.avatar}
									helperText={fieldErrors.avatar}
								/>
							</Box>

							<Button
								sx={{ mt: 3, mb: 2 }}
								variant='contained'
								color='primary'
								type='submit'
								fullWidth
								required
							>{loading ? <CircularProgress size={24} style={{color: 'white'}} /> : 'Update'}</Button>
						</form>
					</TabPanel>

					{/*-----[ Update Password Form ]-----*/}
					<TabPanel value={value} index={1} >
						<form noValidate onSubmit={updateFieldsHandler}>
							<TextField
								// sx={{ mt: 2 }}
								label='Current Password'
								type={!currentPasswordVisibility ? 'text' : 'password'}
								fullWidth
								required
								InputProps={{
									startAdornment: <InputAdornment position='start'> <LockIcon /> </InputAdornment>,
									endAdornment: <InputAdornment position='end'>
										<IconButton onClick={() => setCurrentPasswordVisibility(!currentPasswordVisibility)} >
											{ currentPasswordVisibility ? <Visibility /> : <VisibilityOff />  }
										</IconButton>
									</InputAdornment>
								}}
								value={updateFields.currentPassword}
								onChange={(evt) => setUpdateFields({...updateFields, currentPassword: evt.target.value})}
								error={!updateFields.currentPassword || !!updateFieldErrors.currentPassword}
								helperText={updateFieldErrors.currentPassword}
							/>
							<TextField
								sx={{ mt: 2 }}
								label='New Password'
								type={!newPasswordVisibility ? 'text' : 'password'}
								fullWidth
								required
								InputProps={{
									startAdornment: <InputAdornment position='start'> <LockIcon /> </InputAdornment>,
									endAdornment: <InputAdornment position='end'>
										<IconButton onClick={() => setNewPasswordVisibility(!newPasswordVisibility)} >
											{ newPasswordVisibility ? <Visibility /> : <VisibilityOff />  }
										</IconButton>
									</InputAdornment>
								}}
								value={updateFields.password}
								onChange={(evt) => setUpdateFields({...updateFields, password: evt.target.value})}
								error={!updateFields.password || !!updateFieldErrors.password}
								helperText={updateFieldErrors.password}
							/>
							<TextField
								sx={{ mt: 2 }}
								label='Confirm Password'
								type={!confirmPasswordVisibility ? 'text' : 'password'}
								fullWidth
								required
								InputProps={{
									startAdornment: <InputAdornment position='start'> <LockIcon /> </InputAdornment>,
									endAdornment: <InputAdornment position='end'>
										<IconButton onClick={() => setConfirmPasswordVisibility(!confirmPasswordVisibility)} >
											{ confirmPasswordVisibility ? <Visibility /> : <VisibilityOff />  }
										</IconButton>
									</InputAdornment>
								}}
								value={updateFields.confirmPassword}
								onChange={(evt) => setUpdateFields({...updateFields, confirmPassword: evt.target.value})}
								error={!updateFields.confirmPassword || !!updateFieldErrors.confirmPassword}
								helperText={updateFieldErrors.confirmPassword}
							/>

							<Button
								sx={{ mt: 3, mb: 2 }}
								variant='contained'
								color='primary'
								type='submit'
								fullWidth
								required
							>{loading ? <CircularProgress size={24} style={{color: 'white'}} /> : 'Update'}</Button>
						</form>
					</TabPanel>
				</Paper>
			</Container>
		</Box>
	)
}
export default UserUpdate
