import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutMe } from '../store/userReducer'
// import { showAlert } from '../store/dialogReducer'

import Drawer, { items as listItems } from './drawer'

import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import InputBase from '@mui/material/InputBase'
import Badge from '@mui/material/Badge'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'

import MenuIcon from '@mui/icons-material/Menu'
import MoreIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
// import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircle from '@mui/icons-material/AccountCircle'


const Logout = 'Logout'         // also used to check & remove token to logout
const profileMenuItems = [
  { label: 'Profile', to: '/user/profile' },
  { label: 'Order', to: '/user/payment' },
  { label: 'Dashboard', to: '/user/dashboard' },
  { label: Logout, to: '/login' },
]

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar() {
  const dispatch = useDispatch()
  const history = useHistory()

  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)
  const [openDrawer, setOpenDrawer] = useState(false)
  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const [ searchVal, setSearchVal ] = useState('')

  const { authenticated } = useSelector(state => state.user)
  const { addToCart } = useSelector(state => state.tour)

  // To Show newly added Cart Data on Title
  let totalCart = addToCart ? addToCart.length : 0



  //
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMobileMenuOpen = (event) => setMobileMoreAnchorEl(event.currentTarget)
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null)
  const handleMenuClose = (evt, label) => {
    setAnchorEl(null)
    handleMobileMenuClose()

    if(label === Logout) {
      dispatch(logoutMe())

      // const message = 'You successfully loged out'
      // dispatch( showAlert({ open: true, severity: 'success', message }) )
    }
  }
  const drawerHandler = () => setOpenDrawer(false)

  /* Handling AppBar Right-Side icon on md, and MenuItem on xs:
      . So we have 2 different point to add same event handler.
      . But we have to handle 2 of 3 because Profile always show Menu, and it alread handled */
  const rightSideEventHandler = (evt, itemMessage) => {
    handleMobileMenuClose()
    history.push('/user/order')
  }

  const searchHandler = (evt) => {
    setSearchVal(evt.target.value)

    console.log(evt.target.value)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {profileMenuItems.map(({label, to}, index) => <MenuItem key={label}
          onClick={(evt) => handleMenuClose(evt, label)}
          component={Link}
          to={to}
        >{label}</MenuItem>
      )}
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={(evt) => rightSideEventHandler(evt, 'message')}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={totalCart} color="error">
            <AddShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Shopping Cart</p>
      </MenuItem>

{/*      <MenuItem onClick={(evt) => rightSideEventHandler(evt, 'notification')}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
*/}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Drawer open={openDrawer} drawerHandler={drawerHandler} />
      <AppBar position="static">
        <Toolbar>

        {/*------[ left-side ]------*/}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: {xs: 'inlineBlock', sm: 'none'} }}
            onClick={() => setOpenDrawer(true) }
          >
            <MenuIcon />
          </IconButton>

          { listItems.map(({label, icon, to}, index) => <Button key={label}
            color='inherit'
            component={Link}
            to={to}
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {label}
          </Button>
          )}

        {/*------[ middle-side ]------*/}
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchVal}
              onChange={searchHandler}
            />
          </Search>

        {/*------[ right-side ]------*/}
          <Box sx={{ flexGrow: 1 }} />

          { authenticated ? (
            <>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

                {/*---[ Right: 1st & 2nd Item ]---*/}
                <IconButton onClick={(evt) => rightSideEventHandler(evt, 'message')} size="large" color="inherit" aria-label="show 4 new mails" >
                  <Badge badgeContent={totalCart} color="error">
                    <AddShoppingCartIcon />
                  </Badge>
                </IconButton>

{/*             <IconButton onClick={(evt) => rightSideEventHandler(evt, 'notification')} size="large" color="inherit" aria-label="show 17 new notifications" >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
*/}
                {/*---[ Right: 3rd Item ]---*/}
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  {/*<AccountCircle />*/}
                  <Avatar
                    style={{ width: '2rem', height: '2rem' }}
                    src='/me.jpg'
                    title='Riajul Islam'
                    alt='Opps no User Found'
                  />
                </IconButton>
              </Box>

              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Button
              color='inherit'
              size='small'
              style={{ marginLeft: 24 }}
              component={Link}
              to='/login'
            >Login</Button>
          )}


        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  )
}
