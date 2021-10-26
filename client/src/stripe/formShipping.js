import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addShippingInfo } from '../store/stripeReducer'

import { shippingItems } from './data'

import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { TabPanel } from '../util'

// import InputAdornment from '@mui/material/InputAdornment'
// import Button from '@mui/material/Button'
// import IconButton from '@mui/material/IconButton'

// import EmailIcon from '@mui/icons-material/Email'



const ShippingInfo = () => {
	const [ value, setValue ] = useState(0) 						// to set Tabs
	const dispatch = useDispatch()
	const { shippingObj } = useSelector(state => state.stripe)

	// console.log( shippingObj )

	const tabHandler = (evt, newValue) => setValue(newValue)
	const changeHandler = (evt) => {
		dispatch(addShippingInfo({...shippingObj, [evt.target.name]: evt.target.value}))
	}


	return (
		<Box>
					<Tabs value={value} onChange={tabHandler} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }} >
						<Tab label='Shipping Info'  />
					</Tabs>

					{/*-----[ Update Password Form ]-----*/}
					<TabPanel value={value} index={0} >
						{
							shippingItems.map(({label, name, type}, index) => <TextField key={index}
								sx={ index === 0 ? {} : { mt: 2 } }
								label={label}
								type={type}
								name={name}
								fullWidth
								required
								// InputProps={{
								// 	startAdornment: <InputAdornment position='start'><EmailIcon /></InputAdornment>
								// }}
								value={shippingObj[name]}
								onChange={changeHandler}
								// error={!fields.email || !!fieldErrors.email}
								// helperText={fieldErrors.email}
							/>
							)
						}
					</TabPanel>
		</Box>
	)
}
export default ShippingInfo
