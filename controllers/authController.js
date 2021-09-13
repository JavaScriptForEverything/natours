const User = require('../models/userModel')
const { catchAsync, appError, sendMail } = require('../util')
const { verify } = require('jsonwebtoken')
const { promisify } = require('util')


//--------[ make sure user is login by this middleware ]----------
exports.protect = catchAsync(async(req, res, next) => {
  // if only use for website then cookie is enough, and for api, send token as bearer token.
  let { token } = req.cookies
  if(!token) return next(appError('Please login first', 401))
  	// token = token + 'as' 		// to throw token modification error

  // make this verification also promise
  const {_id, iat } = await promisify(verify)(token, process.env.TOKEN_SECRET)

  const user = await User.findById( _id ).select('+password')
  if(!user) return next(appError('You should need new token', 401))


  // check is Password changed after login or not, if changed then force user to login again with credentials
  const isPasswordChanged = user.isPasswordChanged(iat)
  if(isPasswordChanged) return next(appError('Sorry password changed, please login again', 401))

	req.user = user
  next()
})


//--------[ protect routes based on user role ]----------
exports.restrictTo = (...roles) => (req, res, next) => {
  // req.user.role comes from protect route, if user logined
  const { role } = req.user

  const message = `Sorry you ${role} don't have permission to perform this action.`
  if(!roles.includes(role)) return next(appError(message, 403))

  next()
}


//--------[ /me | /profile  ]----------
exports.me = (req, res, next) => {
  // res.status(200).json({
  //   status: 'success',
  //   user: req.user               // req.user.role comes from protect route, if user logined
  // })

  req.params.id = req.user._id
  next()
}







//--------[ Register or signup ]----------
exports.signup = catchAsync(async(req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    // role: req.body.role,                       // only allow if you want to create admin user
  }

  const user = await User.create( data )
  			user.password = undefined 					// hide user to show password (It is optional)

  res.status(201).json({
    status: 'success',
    user
  })
})


//--------[ login or signin ]----------
exports.login = catchAsync(async(req, res, next) => {
	const { email, password } = req.body

	if( !email || !password ) return next(appError('Please insert email and password', 400, 'ValidationError'))

	// if get password here then this.password will be available in middleware
  const user = await User.findOne({ email }).select('+password')
	if(!user) return next(appError('Email or password is incorrect', 401))

	const isAuthenticated = await user.comparePassword( password )
	if(!isAuthenticated) return next(appError('Email or password is incorrect', 401))

	// generate token & set cookie in userSchema
	const token = user.getTokenAndSendCookie(res)


  res.status(200).json({
    status: 'success',
    token
  })
})


//--------[ Reset password ]----------

/* Password-reset Functionality in 2 steps:
    . supply email               : on /forgotPassword,    : send email, and email have route to reset functionality
    . supply requires fields     : on /resetPassword      : reset the password

   Note : Never ever update password with user's update, always use reset process
*/

// Step-1: POST   /api/users/forgot-password
exports.forgotPassword = catchAsync( async(req, res, next) => {
  const { email } = req.body
  if( !email ) return next(appError('Please enter your email address', 400))

  const user = await User.findOne({ email })
  if( !user ) return next(appError('You are not registerted user, please signup first', 404))

  // const resetToken = user.getTokenAndSendCookie()       // we can use token instead of bello token method
  const resetToken = await user.createPasswordResetToken()
  // await user.save({ validateBeforeSave: false })

  // send resetToken via email.
  let text = 'Please copy/paste the bellow url to reset the password: \n'
      text += `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`
  await sendMail({ to: user.email, text })   // from, to, subject, text



  res.status(201).json({
    status: 'success',
    message: 'An email is send to you, to get to resetToken',
    resetToken       // only for development purpose, delete it after test
  })
})


// Step-2: PATCH   /api/users/reset-password     : why patch, because we just want to update single property not whole document
exports.resetPassword = catchAsync( async(req, res, next) => {
  const { password, confirmPassword } = req.body
  if( !password || !confirmPassword ) return next(appError('Please entire password and confirmPassword fields'))

  const hashedToken = User.createHash(req.params.resetToken)
  let user = await User.findOne({ passwordResetToken: hashedToken })
  if( !user ) return next(appError('resetToken expires, please re-generate token again', 400))

  // save document after modification
  await user.passwordResetHandler(password, confirmPassword)

  // get token and send to user to login
  token = user.getTokenAndSendCookie(res)

  // to update password, we have to update passwordChangedAt property with current update Date time,
  res.status(201).json({
    status: 'success',
    token
  })
})


//--------[ update password ]----------
// PATCH     /api/users/update-password
exports.updateMyPassword = catchAsync( async(req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body

  // 1. Get logined user and verify this user who call he is, so that any people can't update other people password
  const user = req.user           // this route muse be protected route, means loged in user

  /* to compare password, make sure req.user has password field available,
     else `this.password` will be undefined. so  in protect route make sure have .findById(id).select('+password') */
  const isVerified = await user.comparePassword( currentPassword )
  if( !isVerified ) return next(appError('currentPassword is incorrect, 401'))

  // 2. Save password
  user.handleUpdatePassword(password, confirmPassword)

  // 3. As we changed the password, 1. our token need to update or 2. passwordChangedAt must be updated + force to re-login
  const token = user.getTokenAndSendCookie(res)

  res.status(201).json({
    status: 'success',
    token
  })
})


//--------[ updateMe ]----------
// PATCH     /api/users/update-me
exports.updateMe = catchAsync( async(req, res, next) => {
  req.params.id = req.user._id

  next()
})

//--------[ deleteMe ]----------
// DELETE     /api/users/delete-me
exports.deleteMe = catchAsync( async(req, res, next) => {
  req.params.id = req.user._id

  next()
})

