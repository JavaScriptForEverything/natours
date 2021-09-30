import { useState, useEffect } from 'react'
import Helmet from '../components/helmet'
// import Loader from '../components/loader'
// import { showAlert } from '../store/dialogReducer'
// import { useDispatch } from 'react-redux'


import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'


const Contact = () => {
	const [ open, setOpen ] = useState(false)


	return (
		<>
			<Helmet title='Contact Page' />
				<Button
					color='primary'
					variant='contained'
					onClick={() => setOpen(!open)}
				>Toggle Modal</Button>

			<Dialog open={open} >

				<Button
					color='primary'
					variant='contained'
					onClick={() => setOpen(false)}
				>Close Modal</Button>
			</Dialog>



		</>
	)
}
export default Contact
