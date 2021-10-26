import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'


const ProtectedRoute = ({ ...rest }) => {
	const { authenticated } = useSelector(state => state.user)

	return authenticated ? <Route {...rest} /> : <Redirect to='/login' />
}
export default ProtectedRoute


export const PreventedRoute = ({...rest}) => {
	const { authenticated } = useSelector(state => state.user)

	return !authenticated ? <Route {...rest} /> : <Redirect to='/user/profile' />
}
