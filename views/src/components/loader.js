
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'

const Loader = ({ send=false, click=f=>f}) => (
	<Button variant='contained' color='primary' onClick={click} >
		{ send ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Submit' }
	</Button>
)
export default Loader
