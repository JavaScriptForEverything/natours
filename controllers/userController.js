const factoryHandler = require('./factoryHandler')

const User = require('../models/userModel')
const { catchAsync, appError } = require('../util')


exports.getUsers  	= factoryHandler.getAll(User)
exports.getUserById = factoryHandler.getById(User)
exports.updateUser = factoryHandler.updateOne(User)


/*
// GET  /api/users     (this route restrictTo admin & lead-guide only)
exports.getUsers = catchAsync(async(req, res, next) => {
	const users = await User.find()
	// console.log( req.user )

	res.status(200).json({
		status: 'success',
		count: users.length,
		users
	})
})
*/


/*
// GET  /api/users/:id   /api/users/me   /api/users/profile
exports.getUserById = catchAsync(async(req, res, next) => {
	const user = await User.findById(req.params.id)

	res.status(200).json({
		status: 'success',
		user
	})
})
*/


// exports.updateUser = factoryHandler.updateOne(User)




// ----------------[ Convert updateUser to handle by factoryHandler ]---------------
// Method-1: Original Method

// // PATCH  /api/users/:id   /api/users/update-me
// exports.updateUser = catchAsync(async(req, res, next) => {

// 	const message = `Sorry, to update password, goto route: '/api/users/update-my-password'`
//	const updatableFields = 'only name, email & photo are updatable by this update method: '
// 	if( req.body.password ) return next(appError(message, 403))
// 	if( req.body.role ) return next(appError(`You are un-authorized person to change role: ${updatableFields}`, 403))
// 	if( req.body.active ) return next(appError(`Follow the activetion process: ${updatableFields}`, 403))


// 	// // only bello fileds are allow to update, and [ 'password', 'role', 'active' ... ] will be update by other defined routes
// 	// const data = {
// 	// 	name: req.body.name   || req.user.name,     // make optional by asigning default value
// 	// 	email: req.body.email || req.user.email,
// 	// 	photo: req.body.photo || req.user.photo,
// 	// }

// 	// this method is better that above, be cause we can not move this code into separate middleware
// 	// to handle user update with factory function too
// 	req.body.name  = req.body.name 	|| req.user.name
// 	req.body.email = req.body.email || req.user.email
// 	req.body.photo = req.body.photo || req.user.photo

// 	// get id from protect middleware:      req.params.id  = req.user._id
// 	let user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

// 	res.status(201).json({
// 		status: 'success',
// 		user
// 	})
// })



// Method-2 :  Seperate extra data [that is not common other update method] into seperate middleware
// Replace 	: router.route('/:id').patch(updateUser)
// To 		=>  router.route('/:id').patch(filterUser, updateUser)
// 		and
// Replace 	: router.route('/update-me').patch(protect, updateMe, updateUser)
// To 		=>  router.route('/update-me').patch(protect, updateMe, filterUser, updateUser)
exports.filterUser = (req, res, next) => {
	const updatableFields = 'only name, email & photo are updatable by this update method: '

	const message = `Sorry, to update password, goto route: '/api/users/update-my-password'`
	if( req.body.password ) return next(appError(message, 403))
	if( req.body.role ) return next(appError(`You are un-authorized person to change role: ${updatableFields}`, 403))
	if( req.body.active ) return next(appError(`Follow the activetion process: ${updatableFields}`, 403))

	req.body.name  = req.body.name 	|| req.user.name
	req.body.email = req.body.email || req.user.email
	req.body.photo = req.body.photo || req.user.photo

// or bellow method
	// req.body.role = req.user.role 												// prevent from update, update with existing role
	// req.body.password = req.user.password
	// req.body.active = req.user.active

	next()
}
// exports.updateUser = catchAsync(async(req, res, next) => {
// 	// get id from protect middleware:      req.params.id  = req.user._id
// 	let user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

// 	res.status(201).json({
// 		status: 'success',
// 		user
// 	})
// })


// Method-3 :  Now instead of updateUser in Method-2, use this. (comment it here, and copy it on top)
// exports.updateUser = factoryHandler.updateOne(User)

// ----------------[ End of user methods ]---------------






// DELETE  /api/users/:id   /api/users/delete-me
exports.deleteUser = catchAsync(async(req, res, next) => {

	// delete means not delete the user from database now, deactive the user, and after certen time delete all inactive users
	// get id from protect middleware:      req.params.id  = req.user._id
	let user = await User.findByIdAndUpdate(req.params.id, { active: false } )

	// remove token
	const token = res.cookie('token', '', { expires: new Date(Date.now() - 1000) })

	res.status(204).json({
		status: 'success',
		token: null
	})
})
