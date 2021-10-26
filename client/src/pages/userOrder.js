import { useDispatch, useSelector } from 'react-redux'

import MetaData from '../components/metaData'
import { filterObjectByArray, toCapitalize } from '../util'
import { removeItemFromCart } from '../store/tourReducer'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'

import DeleteIcon from '@mui/icons-material/Delete'

let arrOfxs = ['_id', 'price', 'orderQuantity', 'action']


const UserOrder = () => {
	const dispatch = useDispatch()
	const { addToCart } = useSelector(state => state.tour)
	const	arrOfxsObj = addToCart?.map( item => filterObjectByArray(arrOfxs, item ) )


	const deleteHandler = (evt, cart) => {
		dispatch( removeItemFromCart( cart ) )
		// console.log(cart)
	}

	return (
		<>
			<MetaData title='User Orders' />
			{/*-----[ start coding bellow here ]------*/}

			<Box sx={{ my: 3, p: 2 }} >
				<Paper>
					<Table>
						<TableHead>
							<TableRow sx={{ display: 'flex' }} >
								{arrOfxs.map(item => <TableCell align={item === '_id' ? 'left' : 'right'} sx={{
									backgroundColor: (theme) => theme.palette.primary.main,
									color: '#ffffffdd',
									fontWeight: 'bold'
								}} key={item} width='100%'>{toCapitalize(item)}</TableCell> )}
							</TableRow>
						</TableHead>

						<TableBody>
								{arrOfxsObj.map(item => (
									<TableRow sx={{ display: 'flex' }} key={item._id} >
										<TableCell width='100%'>{item._id}</TableCell>
										<TableCell width='100%' align='right'>{item.price}</TableCell>
										<TableCell width='100%' align='right'>{item.orderQuantity}</TableCell>
										<TableCell width='100%' align='right'>
											<IconButton onClick={(evt) => deleteHandler(evt, item)}>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
							))}
						</TableBody>
					</Table>
				</Paper>
			</Box>






		</>
	)
}
export default UserOrder
