const { Router } = require('express')
const {getUsers, getUserById, filterUser, updateUser, deleteUser } = require('../controllers/userController')
const {
	protect, restrictTo,
	me, signup, login,
	forgotPassword, resetPassword, updateMyPassword, updateMe, deleteMe
} = require('../controllers/authController')

module.exports = router = Router()


router.route('/signup').post(signup)     //   /api/users/signup
router.route('/login').post(login)       //   /api/users/login
// Note: Never ever update password with user's update, always use password reset process
router.route('/forgot-password').post(forgotPassword)   // Step-1: Send reset token via email
router.route('/reset-password/:resetToken').patch(resetPassword)     // Step-2: get token from email and use here.

// -----------[ protect bello routes ]-----------
router.use( protect )     // (1) all the routes bellow will be protected

router.route(/\/(me|profile)$/).get(me, getUserById)     //   /api/users/me   or   /api/users/profile
// router.route('/update-me').patch(protect, updateMe, updateUser)
router.route('/update-me').patch(updateMe, filterUser, updateUser)   // When user data in seperate function middleware
router.route('/delete-me').delete(deleteMe, deleteUser)
router.route('/update-my-password').patch(updateMyPassword)


// -----------[ Restrict bello routes to admin ]-----------
router.use( restrictTo('admin') )     // (2) Only Admin allow to use bellow routes

//   /api/users
router.route('/')
	.get(getUsers )

router.route('/:id')
	.get(getUserById)
	.patch(updateUser)
	.patch(updateUser)
	.delete(deleteUser)

