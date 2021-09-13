const factoryHandler = require('./factoryHandler')

const Review = require('../models/reviewModel')
const Tour = require('../models/tourModel')

const { catchAsync, appError } = require('../util')
const { Types } = require('mongoose')


exports.checkObjectId = async(req, res, next) => {

	const { tourId } = req.params
	// 1. tourId is checked by the checkObjectId middleware in Router Level
	if( tourId && !Types.ObjectId.isValid(tourId) ) return next(appError('invalid tourId', 400, 'ValidationError'))

	// 2. Check tour is available by that tourId in database, [userId will be checked by protect middleware]
	const tour = await Tour.findById(tourId)
	if( !tour ) return next(appError(`(Review): No tour found by tourId: ${tourId}.`))

	// if request comes from /api/tours/:tourId/reviews, then 	req.body have tour and user property
	req.body.tour = tourId
	req.body.user = req.user._id

	next()
}

// every review route have access, req.params.tourId & req.user._id  because of middleware in tourRoute.js nestex section


/*it not works on Reviews, because we add some extra arguments via middleware which is only available with reviews
		1. if we add those required params, either inside review controller instead of seperate middleware  or
		2. add that middleware with factory method (means build factory method with both 2 middleware in mind) */
// exports.getAllReviews = factoryHandler.getAll(Review)
exports.getReviewById = factoryHandler.getById(Review, 'reviews')
// exports.getReviewById = factoryHandler.getById(Review, {path: 'reviews', select: '-__v'})
exports.addReview 		= factoryHandler.createOne(Review)
exports.updateReview 	= factoryHandler.updateOne(Review)
exports.deleteReview 	= factoryHandler.deleteOne(Review)




// GET 	/api/reviews 	/api/tours/:tourId/reviews
exports.getAllReviews = catchAsync( async(req, res, next) => {

	 // Get Reviews on particular tour, if have tourId, else empty object. that means
		// 	. if route comes from: /api/tours/:tourId/reviews 	: then only show reviews on particular tour else
		// 	. if route comes from:/api/reviews 									: then show all reviews of all routes
	const filter = req.params.tourId ? { tour: req.params.tourId } : {}
	const reviews = await Review.find( filter )

	res.status(200).json({
		status: 'success',
		count: reviews.length,
		reviews
	})
})
/*
*/








/*
// GET 	/api/reviews/:id 	/api/tours/:tourId/reviews/:reviewId
exports.getReviewById = catchAsync( async(req, res, next) => {
	const { id } = req.params

	const review = await Review.findById(id)
	if( !review ) return next(appError(`No Review found by reviewId: ${id}`))

	res.status(201).json({
		status: 'success',
		review
	})
})
*/




/*
// POST 	/api/reviews 	or /api/tours/:tourId/reviews
exports.addReview = catchAsync( async(req, res, next) => {
	// if request comes from /api/tours/:tourId/reviews, then
	// 	checkObjectId middleware add user & tour  property automatically,
	// 	we only have to add review & rating property
	const review = await Review.create(req.body)

	res.status(201).json({
		status: 'success',
		review
	})
})
*/



