export const toCapitalize = (content) => content.replace(/\b\w/g, letter => letter.toUpperCase() )
// String.prototype.toCapitalize = function() {
// 	return this.replace(/\b\w/g, letter => letter.toUpperCase() )
// }

export const shorter = (content, length=250) => {
	if(content.length > length) return content.substr(0, length) + '...'
	return content
}

// to handle dispatch error for front-end side
export const catchAsyncDispatch = (fn, showError ) => (dispatch, getStore) => fn(dispatch, getStore).catch(err => {
	dispatch( showError(err.response.data.message) )
	// console.log(err.response.data.message)
})



// -----------[ others ]-----------
export const createInputItem = (label='', name='', type='text') => ({label, name, type})
