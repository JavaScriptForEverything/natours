import Snackbar from './snackbar'
import Loader from './loader'

import AppBar from './appBar'
// import Header from './header'
import Footer from './footer'

import CssBaseline from '@mui/material/CssBaseline'


const Layout = ({ children }) => {

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
