import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../store/userReducer'

import Snackbar from './snackbar'
import Loader from './loader'

import AppBar from './appBar'
// import Header from './header'
import Footer from './footer'

import CssBaseline from '@mui/material/CssBaseline'


const Layout = ({ children }) => {
	const dispatch = useDispatch()
	const { authenticated } = useSelector( state => state.user )

	/*Get use here so that every route have access user
			authenticated = true means we have token on localStorage.getItem('token') */
	useEffect(() => authenticated && dispatch(getUser()) , [dispatch])

	return (
		<>
			<CssBaseline />
			<AppBar />
			<Snackbar /> 		{/*Add Alert on parent Component, so that all child component can append from it*/}
			<Loader /> 			{/*full screen Loading Effect*/}


			{/*<Header />*/}
			{children}
			<Footer />
		</>
	)
}
export default Layout
