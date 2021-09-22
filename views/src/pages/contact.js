// import { useState } from 'react'
import Helmet from '../components/helmet'
// import Loader from '../components/loader'
import { showAlert } from '../store/dialogReducer'
import { useDispatch } from 'react-redux'


import Button from '@material-ui/core/Button'


const Contact = () => {
	// const [ send, setSend ] = useState(false)
	// const [ open, setOpen ] = useState(false)

	// const message = 'Error Message'
	// const severity = 'success'
	const dispatch = useDispatch()

	const message = 'Login Success'
	const severity = 'success'

	return (
		<>
			<Helmet title='Contact Page' />


			<Button
				variant='contained'
				color='primary'
				onClick={() => dispatch(showAlert({ open: true, message, severity }))}
			>
				Toggle
			</Button>


		</>
	)
}
export default Contact
