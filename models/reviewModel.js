const { Schema, model } = require('mongoose')
const Tour = require('./tourModel')


/* "review": "Cras mollis nisi parturient mi",
    "rating": 5,
    "user": "5c8a1dfa2f8fb814b56fa181",
    "tour": "5c88fa8cf4afda39709c2955"*/
const reviewSchema = new Schema({
	review: {
		type: String,
		required: true,
		unique: true, 					// Some reviews are duplicated in reviews.json
		trim: true,
		minLength: 2,
		maxLength: 400
	},
	rating: {
		type: Number,
		min: 0,
		max: 5
	},

	user: { 												// PARRENT REFERENCE: require only the parrent's ID (userId) to reference to
		type: Schema.Types.ObjectId, 		// Long Form 	[ ObjectId() is a function, go generate ObjectId ]
		ref: 'User',
		required: [ true, 'Review must be by a user' ]
	},
	tour: { 												// PARRENT REFERENCE: require only the parrent's ID (tourId)
		type: Schema.ObjectId,  			// Sort Form (no need .Types )
		ref: 'Tour',
		required: [ true, 'Review must be belong to a tour' ]
	}

}, {
	timestamps: true,
	// toJSON: { virtuals: true },
	// toObject: { virtuals: true }
})



// (4) by Giving index, to tour and user, give One user can add only one review per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true }) 		// tourId & userId will be unique in review
// Why not it working





// (1)
reviewSchema.pre(/^find/, function(next) {
	this.select('-__v -createdAt -updatedAt')

	// this.populate('user tour') 											// this schema's field name
	// this.populate('user').populate('tour') 					// chining method

	this.populate({
		path: 'user',

		/* if we try to use:  select('role name') 	it throw error of projection: used mixture of '+' and '-'
				- you may wandaring we use 	this.select('rating review user tour') 	How did we mixtured.

			Actually the this.select() is projection of reviewSchema and users content
			comes via userSchema both are seperate query The mixtures happend inside userSchema.

			We use in userSchema: this.select('-__v -createdAt -updatedAt') 	// to hide these fields
			and now try to use: 	this.populate('user tour') 									// to show only fields

			This the problems by mixturing, and the errors complain about this problems.

			To solve this problem, in userSchema.select() and this.populate({ select: ''}) both must have
			select or deselect not mixture */
		select: '-__v'
	})
	// // to prevent Population Chaining we have to disable this populate, It is not so importent to reviews
	// .populate({path: 'tour', select: 'name'})

	next()
})




// (2) Define function here
// .aggregate() method is only available in Model that's why we use .statics, [not .methods.]
reviewSchema.statics.calcRatingsAvarage = async function(tourId) {
	const stats = await this.aggregate([ 			// 1. Get all Reviews from 	Review.find({})
		{ $match: { tour: tourId }}, 						// filter to only get reviews of same tour by tourId: === Query.find({tour: tourId})
		{ $group: { 														// Build new Document from all documents found via pipeline
			_id: '$tour', 												// represent on base on 'tour' field
			nRating: { $sum: 1 }, 								// field-1: count all reviews found via pipeline
			avgRating: { $avg: '$rating'} 				// get avg value from 'rating' field from all the documents
		}}
	])
	// console.log( stats )


	// Now Save reviews data into tours dataset
	await Tour.findByIdAndUpdate(tourId, {
		ratingsQuantity: stats.length ? stats[0].nRating 		: 0,
		ratingsAverage : stats.length ? stats[0].avgRating 	: 4.7,
	})
}
// modify calcRatingsAvarage on review created, next handle for update & delete too
reviewSchema.post('save', function() { 			// Both pre() and post() both works fine.
	/* 	this === Schema/Query 								// We can get Query from Model 				[top-to-bottom]
			this.constructor === Model  					// We can alos get Model from Query 	[bottom-to-top]
	*/
// (3) invoke that function that schema Level method here
	// Trick to get model inside pre('save')/post('save') hook
	this.constructor.calcRatingsAvarage(this.tour) 	// <===> Review.calcRatingsAvarage(tour._id)
})




/* (3) Modify calcRatingsAvarage on review update & delete too

Method-1:
reviewSchema.pre(/^findOneAnd/, async function(next) {
	const doc = await this.findOne() 										// trick to get doc Object inside pre('find') hook
	doc.constructor.calcRatingsAvarage(doc.tour) 	// <===> Review.calcRatingsAvarage(tour._id)
	next()
})

// Method-2: Passing value from pre middleware to post middleware
reviewSchema.pre(/^findOneAnd/, async function(next) {
	this.doc = await this.findOne() 										// trick to get doc Object inside pre('find') hook
	next()
})
reviewSchema.post(/^findOneAnd/, async function() {
	this.doc.constructor.calcRatingsAvarage(this.doc.tour)
})

Method-3: no need method-1 and Method-2, because post has doc argument */
reviewSchema.post(/^findOneAnd/, async function(doc) {
	doc.constructor.calcRatingsAvarage(doc.tour)
})




/* Many ways to get Model inside pre/post hook, no mater it is 'save' or 'find' event used
 		. 3 ways to get Model inside pre/post hook, on 'save' event
 		. 3 ways to get Model inside pre/post hook, on 'find' event

reviewSchema.pre(/^find/, function(next) {
	// console.log( this ) 													// Return Query
	console.log( this.findOne().constructor ) 			// (1) this.findOne() => doc &  Doc.constructor => Model
	next()
})
reviewSchema.post(/^find/, function(doc) {
	// console.log( doc ) 													// return doc
	// console.log( this.constructor ) 							// (2) `this` === doc 	so 	this.constructor => Model

	console.log( doc.constructor ) 									// (3) if doc is single document then this.constructor === doc.constructor but
}) 																								// 			if doc return array, then doc.constructor is Array not Model
*/

module.exports = model('Review', reviewSchema)
