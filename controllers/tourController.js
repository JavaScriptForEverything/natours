const factoryHandler = require('./factoryHandler')

const Tour = require('../models/tourModel')
const { appError, catchAsync, apiFeatures } = require('../util')





exports.getTours 		= factoryHandler.getAll(Tour)
exports.addTour    	= factoryHandler.createOne(Tour)
exports.getTour    	= factoryHandler.getById(Tour, 'reviews')
exports.updateTour 	= factoryHandler.updateOne(Tour)
exports.deleteTour 	= factoryHandler.deleteOne(Tour)




/*
// GET   /api/tours
exports.getTours = catchAsync(async (req, res, next) => {

	// const tours = await Tour.find()
	let tours = apiFeatures(Tour.find(), req.query)
			tours = await tours.pagination().filter().sort().search().query

	const countDocuments = await Tour.countDocuments()

	res.status(200).json({
		status: 'success',
		totalTours: countDocuments,
		count: tours.length,
		tours
	})
})
*/



/*
// POST   /api/tours
exports.addTour = catchAsync( async (req, res, next) => {
	const tour = await Tour.create(req.body)

	res.status(201).json({
		status: 'success',
		tour
	})
})
*/



/*
// GET   /api/tours/:id
exports.getTour = catchAsync( async (req, res, next) => {
	// const tour = await Tour.findById(req.params.id)
	const { id } = req.params

	const tour = await Tour.findById(id).populate('reviews')
	if( !tour ) return next(appError(`No Tour found by tourId: ${id}`))

	// const tour = await Tour.findById(req.params.id).populate({
	//   path: 'reviews',
	// })

	res.status(200).json({
		status: 'success',
		tour
	})
})
*/




/*
// PATCH   /api/tours/:id
exports.updateTour = catchAsync( async (req, res, next) => {
	const { id } = req.params

	const tour = await Tour.findById(id)
	if(!tour) return next(appError('No Tour found'))

	const newTour = await Tour.findByIdAndUpdate( id, req.body, { new: true, runValidators: true })

	res.status(201).json({
		status: 'success',
		tour: newTour
	})
})
*/


/*
// DELETE   /api/tours/:id
exports.deleteTour = catchAsync( async (req, res, next) => {
	const { id } = req.params

	const tour = await Tour.findById(id)
	if(!tour) return next(appError('No Tour found'))

	 await Tour.findByIdAndDelete( id )

	res.status(204).json({
		status: 'success',
		tour
	})
})
*/




// used to calculated avarage, sum, ...
// GET   /api/tours/tour-stats
exports.getTourStaticties = catchAsync( async(req, res, next) => {
	let tours = await Tour.aggregate([
		{ $match: { ratingsAverage: {$gte : 4.5}} },           // === .find()
		{ $group: {                                            // to create new document
			// _id: null,                                        // create group based on nothing.
			// _id: '$difficulty',                               // create group based on 'dificulty' field.
			// _id: '$ratingsAverage',
			_id: { $toUpper: '$difficulty' },                    // Make label to toUpperCase()
			numTours: { $sum: 1 },                               // sum = sum + 1
			numRatings: { $sum: '$ratingsQuantity' },

			avgRatings: { $avg: '$ratingsAverage' },             // agrRatings field

			minPrice: { $min: '$price' },
			maxPrice: { $max: '$price' },
			avgPrice: { $avg: '$price' },
		}},
		{ $sort: { avgPrice: -1 }},                            // sort by price descending order

		// We can repeat the same pipeline again and again but must have to follow order.
		// { $match: {_id: {$ne: 'EASY' }} },                     // this _id is the _id of group created document

	])


	res.status(200).json({
		status: 'success',
		count: tours.length,
		tours
	})
})


// GET   /api/tours/tour-monthly-plan
exports.getTourMonthlyPlan = catchAsync( async(req, res, next) => {
	const year = req.params.year       // 2021

	// get documents of only one years:  [2021-01-01 - 2021-12-31]
	let tours = await Tour.aggregate([
		{ $unwind: '$startDates' },     // make every array of startDates item, a seperate document.
		{ $match: { startDates: {
			$gte : new Date(`${year}-01-01`),
			$lte : new Date(`${year}-12-31`),
		}}},
		{ $group: {
			_id: { $month: '$startDates' },     // $month : operator get number of month from date.
			numTours: { $sum: 1 },
			tours: { $push : '$name' }          // only push name field of the original document, into this new tours field
		}},
		{ $addFields: { month: '$_id' }},     // add new field of same as _id field   => Rename field
		{ $project: { '_id': 0 }},            // hide the _id Fields
		{ $sort: { numTours: -1 }},           // descending order
		// { $limit: 5 }                      // Limit
	])


	res.status(200).json({
		status: 'success',
		count: tours.length,
		tours
	})
})


// GET 	/tours-within/:distance/center:latlong/unit/:unit
//     	/tours-within/23/center/32,453/unit/mi

/*
			{
			   <location field>: {
			      $geoWithin: { $centerSphere: [ [ <x>, <y> ], <radius> ] }
			   }
			}

		x = longitude 			[ MongoDB starts with Longitude first, but google use latitude first ]
		y = latitude

	Radius of Earth = 6,378 km (3,963 mi)
	const radius = unit === 'mi' ? distance/3963 : distance/6378 */
exports.getToursWithIn = catchAsync( async (req, res, next) => {
	const { distance = 200, latlong, unit } = req.params
	const [lat, long] = latlong.split(',')
	// console.log( distance, latlong, unit )

	if(!lat || !long) return next(appError('Please add location like: "center/lat,long" ', 400))

	// Radius of Earth = 6,378 km (3,963 mi)
	const radius = unit === 'mi' ? distance/3963 : distance/6378

	const tours = await Tour.find({
		startLocation : { $geoWithin : {
			$centerSphere : [ [long, lat], radius ]
		}}
	})

	res.status(200).json({
		status: 'success',
		count: tours.length,
		tours
	})
})
/* Note: We can see GeoLocation data in mongodb compass,
		. Compass > (Tab) Schema > Analize 	> looking field which has geoLocation data in it
		Note: To see map all the tours must have geoLocation, if any document don't have geoLocation the map will not shown
*/

// 	GET 	/distances/:latlong/unit/:unit
exports.getToursDistances = catchAsync(async (req, res, next) => {

	const { latlong, unit } = req.params
	const [lat, long] = latlong.split(',')
	// console.log( latlong, lat, long )

	if(!lat || !long) return next(appError('Please add location like: "distances/lat,long" ', 400))

	const distances = await Tour.aggregate([
		/* Error: $geoNear is only valid as the first stage in a pipeline, because we add aggrigate in schema,
				which run first then it runs, that's it complain about.

				To fix this problems,
					1. We can comment that middleware (which will remove secure tour hidden features)
					2. We have to make condition, if this pipeline works then ignore that middleware

		*/
		{	$geoNear: { 															// only one $operator for geoLocation in aggregate pipeline
			near : {
				type: 'Point',
				coordinates: [ long * 1, lat * 1 ]
			},
			distanceField: 'distance',
			spherical: true
		}}
	])

	res.status(200).json({
		status: 'success',
		// count: tours.length,
		distances
	})


})
