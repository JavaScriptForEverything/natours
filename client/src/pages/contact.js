import { useState } from 'react'

import MetaData from '../components/metaData'

// import Typography from '@mui/material/Typography'
// import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'

const Contact = () => {
	const [ value, setValue ] = useState(0)

	return (
		<>
			<MetaData title='Contact Page' />
			{/*-----[ start coding bellow here ]------*/}
			<h2>Build Contact Page</h2>

			<Rating value={value} onChange={(evt, newValue) => setValue(newValue)} />

		</>
	)
}
export default Contact
