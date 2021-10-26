import { useSelector } from 'react-redux'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
// import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
// import ListSubheader from '@mui/material/ListSubheader'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
// import IconButton from '@mui/material/IconButton'


// To show Only Read from localStorage.getItem('addToCart'), no need dispatch and details handler in store
const Details = () => {
	const shippingCharge = 0
	const { addToCart: tours } = useSelector(state => state.tour )

	return (
		<>
			<Tabs value={0} onChange={f=>f} sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tab label='Tour Details' />
			</Tabs>
			<List>
				{tours?.map((tour, index) => (
					<ListItem key={tour._id}>
						<ListItemText
							primary={tour.name}
							secondary={tour.summary}
						/>
						<ListItemIcon> {tour.orderQuantity} 	x  {tour.price.toFixed(2)} </ListItemIcon>

					</ListItem>
				))}

				<ListItem>
					<ListItemText primary='Shipping'/>
					<ListItemIcon> $ {shippingCharge.toFixed(2)} </ListItemIcon>
				</ListItem>

				<Divider sx={{ mt: 1 }} />
				<ListItem>
					<ListItemText primary='Total' />
					<ListItemIcon>
						$ {tours?.reduce((total, tour) => total + tour.price*tour.orderQuantity, shippingCharge).toFixed(2) }
					</ListItemIcon>
				</ListItem>
			</List>
		</>
	)
}
export default Details
