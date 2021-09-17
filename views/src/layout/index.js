import Header from './_header'
import Footer from './_footer'

import CssBaseline from '@material-ui/core/CssBaseline'



const Layout = ({ children }) => {

	return (
		<>
			{/*----[ Reset Css ]----*/}
			<CssBaseline />

			<Header />
			{children}
			<Footer />
		</>
	)
}
export default Layout
