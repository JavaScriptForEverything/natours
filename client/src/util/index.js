import { isEmail } from 'validator'
import Box from '@mui/material/Box'

export const toCapitalize = (str) => str.replace(/\b./g, match => match.toUpperCase())

export const shorter = (content, length=250) => {
	if(content.length > length) return content.substr(0, length) + '...'
	return content
}

// to handle dispatch error for front-end side
export const catchAsyncDispatch = (fn, showError = f=>f ) => (dispatch, getStore) => fn(dispatch, getStore).catch(err => {
	dispatch( showError(err.response.data.message) )
	// console.log(err.response.data.message)
})


// Filter Object By Array
export const filterObjectByArray = (arr, obj) => {
	const tempObj = {}

	if( !arr ) return console.log('1st argument should by Array but given ' + typeof arr)
	if( !obj ) return console.log('2nd argument should by Object but given ' + typeof obj)

	if(arr.constructor !== Array) return console.error('1st argument must by an Array, but given ' + typeof obj )
	if(obj.constructor !== Object) return console.error('2nd argument must by an Object, but given ' + typeof obj )

	Object.entries(obj).forEach(([key, value]) => {
		if( arr.includes(key)	) tempObj[key] = value
	})

	return tempObj
}


// used with Tabs + Tab Component
export const TabPanel = ({ children, value, index}) => (
	<Box hidden={value !== index } >
		{children}
	</Box>
)


// Form Validator
export const formValidator = (obj, errorStateUpdateMethod, requireLength=4) => {
	const errorObj = {}

	if( obj.username && obj.username.length < 4)  errorObj.username = 'name reqired 4 digit long'
	if( obj.email && !isEmail(obj.email) ) errorObj.email = 'Invalid Email address'

	if(obj.password && obj.password.length < requireLength ) errorObj.password = `Password must be ${requireLength} character long`
	if(obj.password && obj.confirmPassword && obj.password !== obj.confirmPassword) errorObj.confirmPassword = 'Confirm Password not matched'

	Object.entries(obj).forEach(([key, value]) => {
		if(value.trim() === '')  errorObj[key] = `'${key}' field is empty`
	})


		errorStateUpdateMethod(errorObj)
		return Object.keys(errorObj).every(item => item === '')
}

