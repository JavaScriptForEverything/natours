const { Router } = require('express')
const { protect, restrictTo } = require('../controllers/authController')
const {
	getAllReviews,
	addReview,
	getReviewById,

	updateReview,
	deleteReview
} = require('../controllers/reviewController')



module.exports = router = Router({ mergeParams: true }) 		// To get params form before router to nextex router


// -----------[ protect bello routes ]-----------
router.use( protect ) 					// all reviews is protected

// 	/api/reviews
router.route('/')
	.get(getAllReviews)
	.post(restrictTo('user'), addReview) 	// admin or 'lead-guide' should not create any review

router.route('/:id') 						// in previous router we defined, :tourId and now we define :id, 	previous params will win.
	.get(getReviewById)
	.patch(restrictTo('user', 'admin'), updateReview)
	.delete(restrictTo('user', 'admin'), deleteReview)
