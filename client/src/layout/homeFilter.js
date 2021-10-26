import { useState } from 'react';

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'


const buttons = [
	{
		label: 'category',
		items: ['laptop', 'smartphone', 'television']
	},
	{
		label: 'difficulty',
		items: ['easy', 'medium', 'hard']
	},
	{
		label: 'location',
		items: ['dhaka', 'rajshahi', 'cumilla']
	},
]


const HomeFilter = () => {
	const [ fields, setFields ] = useState({})
	const [ anchorEl, setAnchorEl ] = useState()


	const buttonClicked = (evt) => setFields({ value: evt.target.value, target: evt.target })
	const buttonClosed 	= (evt) => setFields({ value: -1 })
	const menuItemHandler = (evt, items) => {
		buttonClosed() 													// close memu popup
		const item = items[evt.target.value]

		console.log( item)
	}


	return (
		<Accordion defaultExpanded={false} >
			<AccordionSummary expandIcon={<ExpandMoreIcon />} > {/* --- It roted 180 deg on expand ---- */}
				<FilterAltOutlinedIcon />
			</AccordionSummary>

			<AccordionDetails sx={{ display: 'flex', gap: 1 }} >
				{buttons.map(({label, items}, key) => (
					<Box key={key} >
						<Button
							value={key}
							variant='outlined'
							endIcon={ fields.value == key ? <ExpandLessIcon /> : <ExpandMoreIcon /> }
							onClick={buttonClicked}
							sx={{ textTransform: 'capitalize' }}
						>{label}</Button>

						<Menu
							open={fields.value == key }
							anchorEl={fields.target}
							onClose={buttonClosed}
						>
							{items.map( (item, index) => (
								<MenuItem key={item}
									value={index}
									onClick={(evt) => menuItemHandler(evt, items)}
									sx={{ minWidth: 200, textTransform: 'capitalize' }}
								>{item}</MenuItem>
							))}
						</Menu>
					</Box>
				))}
			</AccordionDetails>
		</Accordion>
	)
}
export default HomeFilter
