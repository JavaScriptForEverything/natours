import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { toCapitalize } from '../util'
import Search from './search'

import { makeStyles } from '@material-ui/core'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'


import MenuIcon from '@material-ui/icons/Menu'


const useStyles = makeStyles( theme => ({
	root: {
		marginBottom: theme.spacing(2)
	}
}))



const navItems = [
	{ label: 'home', path: '/' },
	{ label: 'about', path: '/about' },
]
const menuItems = ['profile', 'dashboard', 'logout']


const Navbar = () => {
	const classes = useStyles()
	const history = useHistory()
	const [ openMenu, setOpenMenu ] = useState(false)
	const [ anchorEl, setAnchorEl ] = useState(null)

	const user = false

	const avatarClicked = (evt) => {
		evt.preventDefault()
		setAnchorEl(evt.currentTarget)
		setOpenMenu(true)
	}
	const handleMenuItem = (evt) => setOpenMenu(false)


	return (
		<AppBar position='relative' className={classes.root} >
			<Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

				{navItems.map( ({label, path}, key) => <Button
					key={key}
					color='inherit'
					component={Link}
					to={path}
				> {label} </Button>
				)}

				{user ? (
					<>
					<IconButton
						style={{ marginLeft: 'auto' }}
						onClick={avatarClicked}
					>
					<Avatar
						title='Jonus Scheman'
						src='/users/user-1.jpg'
						alt='/users/user-1.jpg'
					/>
					</IconButton>
					<Menu
						open={openMenu}
						anchorEl={anchorEl}
						onClose={() => setOpenMenu(false)}
					>
						{menuItems.map( (item, key) => <MenuItem
								key={key}
								value={key}
								onClick={handleMenuItem}
								component={Link}
								to={`/${item}`}
							> {toCapitalize(item)} </MenuItem>
						)}
					</Menu>
					</>
				) : (
				<Button
					style={{ marginLeft: 'auto' }}
					color='inherit'
					component={Link}
					to='/login'
				> Login </Button>
				)}


			</Toolbar>
		</AppBar>

	)
}
export default Navbar
