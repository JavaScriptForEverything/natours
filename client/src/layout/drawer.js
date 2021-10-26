import { useHistory } from 'react-router-dom'
import { toCapitalize } from './../util'

import makeStyles from '@mui/styles/makeStyles'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'

import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import CallIcon from '@mui/icons-material/Call'


// ---[ also used inside appBar.js ]---
// export const items = [
// 	{label: 'home', icon: <HomeIcon />, to: '/'},
// 	{label: 'about', icon: <PersonIcon />, to: '/about'},
// 	{label: 'contact', icon: <CallIcon />, to: '/contact'},
// ]
const createItem = (label='', icon=f=>f, to='') => ({label, icon, to})
export const items = [
	createItem('home', <HomeIcon />, '/'),
	createItem('about', <PersonIcon />, '/about'),
	createItem('contact', <CallIcon />, '/contact'),
]


const useStyles = makeStyles( theme => ({
	paper: { width: '50%' }
}))

const Panel = ({ open, drawerHandler }) => {
	const classes = useStyles()
	const history = useHistory()

	const itemHandler = (evt, to) => {
		drawerHandler()
		history.push(to)
	}

	return (
		<>
			<Drawer open={open} onClose={drawerHandler} classes={{ paper: classes.paper }} >
				<Toolbar />
				<Divider />
	      <List>
	        {items.map(({label, icon, to}, index) => (
	          <ListItem button key={label} onClick={(evt) => itemHandler(evt, to)}>
	            <ListItemIcon> {icon} </ListItemIcon>
	            <ListItemText primary={toCapitalize(label)} />
	          </ListItem>
	        ))}
	      </List>
				<Divider />
				<Toolbar />

			</Drawer>
		</>
	)
}
export default Panel
