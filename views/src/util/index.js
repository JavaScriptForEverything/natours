export const toCapitalize = (content) =>
content.replace(/\b\w/g, letter => letter.toUpperCase() )


export const shorter = (content, length=250) => {
	if(content.length > length) return content.substr(0, length) + '...'
	return content
}
