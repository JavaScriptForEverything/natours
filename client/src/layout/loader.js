import { useDispatch, useSelector } from 'react-redux'
import { showLoader } from '../store/dialogReducer'

import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';


const Loder = ({ open=false, handleClose=f=>f}) => {
  const dispatch = useDispatch()
  const { loader } = useSelector(state => state.dialog)

  return (
    <Dialog
      open={ loader }
      onClose={() => dispatch(showLoader())}
      fullScreen
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          width: '100vw', height: '100vh',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }
      }}
    >
      <CircularProgress
      />
    </Dialog>
  )
}
export default Loder
