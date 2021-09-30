import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ ...rest }) => {
	const { loading, authenticated } = useSelector( state => state.users )

	// return authenticated ? <Route component={Component} {...rest} /> : <Redirect to='/' />
	return !loading && authenticated ? <Route {...rest} /> : <Redirect to='/login' />
}

export default ProtectedRoute
