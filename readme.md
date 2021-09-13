# Documentation for my project:

My project has main 4 sections: (data-sets) 	 	/api/tours/*
1. tours 									: The main topic for our side
2. users
3. reviews
4. bookings

### Tours have bello routes
	- admin or lead-guide User 	: can create Tours 			[ but can't create any review ]
	- user or guide User 				: can create Reviews, 	[ but can't create any tour ]


router.route('/tour-stats').get(getTourStaticties)
router.route('/tour-monthly-plan/:year').get(getTourMonthlyPlan)


// Working with GeoLocation Data
// /api/tours/tours-within/23/center/32,453/unit/mi               : it is clear way then
// /api/tours/tours-within?distance=23&center=32,453&unit=mi      : this way
router.route('/tours-within/:distance/center/:latlong/unit/:unit').get(getToursWithIn)
router.route('/distances/:latlong/unit/:unit').get(getToursDistances)


router.route('/')
  .get(getTours)
  .post(addTour)     		// only admin or lead-guide can create post


router.route('/:id') 		// Only admin have access bellow route
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)



### Create reviews on tours  	/api/reviews

router.route('/')
	.get(getAllReviews)
	.post(restrictTo('user'), addReview) 			// admin or 'lead-guide' should not create any review

router.route('/:id') 						// in previous router we defined, :tourId and now we define :id, 	previous params will win.
	.get(getReviewById)
	.patch(restrictTo('user', 'admin'), updateReview)
	.delete(restrictTo('user', 'admin'), deleteReview)


### Create users   	/api/users

router.route('/signup').post(signup)     //   /api/users/signup
router.route('/login').post(login)       //   /api/users/login
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

