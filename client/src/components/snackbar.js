import { useDispatch, useSelector } from 'react-redux'
import { showAlert } from '../store/dialogReducer'

import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'



const SnackbarComponent = () => {
	const dispatch = useDispatch()
	const { open, message, severity } = useSelector( state => state.dialogs )

	const closeAlert = () => dispatch( showAlert({ open: false, message: '' }) )


	return (
		<Snackbar
			open={open}
			message='Error message'
			anchorOrigin={{
				horizontal: 'center',
				vertical: 'top'
			}}
			onClick={ closeAlert }
			onClose={ closeAlert }
			autoHideDuration={3000}
		>
			<Alert
				severity={severity}
				color={severity}
				variant='filled'
			> {message} </Alert>
		</Snackbar>
	)
}
export default SnackbarComponent
