import { useState, useEffect } from 'react'
import axios from 'axios'

import MetaData from '../components/metaData'
import Button from '@mui/material/Button'


const UserDashboard = () => {
	const [ image, setImage ] = useState('')

	// const reader = new FileReader()
	// reader.readAsDataURL(image)
	// reader.adddEventListener('load', () => {
	// 	if( reader.readyState === 2 ) image = reader.result
	// })

	// useEffect(() => {
	// 	fetch('/user.jpg')
	// 		.then(res => res.blob())
	// 		.then(blob => {
	// 			const dataURL = URL.createObjectURL(blob)
	// 			setImage( dataURL )
	// 		})

	// }, [])


	useEffect( async () => {
		const { data: blob } = await axios.get('/user.jpg', { responseType: 'blob' })
		const dataURL = URL.createObjectURL(blob)
		setImage(dataURL)
		console.log(dataURL)
		// const reader = new FileReader()
		// reader.readAsDataURL(blob)
		// reader.onload = () => (reader.readyState === 2) && setImage(reader.result)
	}, [])





	return (
		<>
			<MetaData title='Deshboard Page' />
			{/*-----[ start coding bellow here ]------*/}

			<a href={image} id='img' download='default.jpg'>Download</a>
			<img src={image} alt="" />


		</>
	)
}
export default UserDashboard
