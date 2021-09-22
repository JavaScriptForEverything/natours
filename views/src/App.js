import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMe } from './store/userReducer'

import Snackbar from './components/snackbar'


import Layout from './layout'
import Routes from './pages/_routes'

function App() {
  const dispatch = useDispatch()
  const { authenticated } = useSelector( state => state.users )

  /*rerender or call the getMe() function on authenticated property change
      . Without it we have to refresh page after login to see/get user from database */
  useEffect(() => dispatch(getMe()), [dispatch, authenticated])

  return (
    <>
      <Snackbar />   {/* To Show alert on dispatch */}
      <Layout>
        <Routes />
      </Layout>
    </>
  )
}

export default App
