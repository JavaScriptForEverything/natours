import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const AddLabelOverImage = (props) => {
	const {
		src='/cover.jpg',
		image='/cover.jpg',
		text='Text Left',
		width='200px',
		padding=10
	} = props

	return (
		<Box sx={{ position: 'relative', width: width }} >
			<img src={src} image={image} title={image} alt={image} width='100%' />
			<Typography sx={{
				position: 'absolute',
				top: 0, left: 0, right: 0, bottom: 0,
				color: (theme) => theme.palette.secondary.main,

				display: 'flex',
				justifyContent: 'flex-start',
				alignItems: 'flex-start',
				padding: {padding},
				// backgroundColor: 'rgba(250, 250, 250, .4)',
				backgroundColor: 'rgba(250, 250, 250, .4)',
				height: '40px'


			}}>{text}</Typography>
		</Box>

	)
}
export default AddLabelOverImage
