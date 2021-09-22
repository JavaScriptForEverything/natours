const { Schema, model } = require('mongoose')
const slugify = require('slugify')


const tourSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,        // unique property also create index, means if we search by name, it will response quickly
		trim: true,
		lowercase: true
	},
	slug: String,         // we can add slug by hook or by default value.
	difficulty: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		enum: ['easy', 'medium', 'difficult'],
	},
	duration: Number,
	maxGroupSize: Number,

	price: {
		type: Number,
		min: 0,
		max: 10000,
	},
	priceDiscount: {
		type: Number,
		// validate: function(value) {
		//   return value < this.price    // return (value < this.price) ? true : false
		// }
		validate: {
				validator: function(value) {
					// this type of validator not working on update, only for new document create [ save(), create()]
					return value < this.price    // return (value < this.price) ? true : false
				},
				message: 'discount ({VALUE}) can\' more than price'
		}
	},
	summary: {
		type: String,
		minlength: 10,
		maxlength: 150,
	},
	description: {
		type: String,
		minlength: 10,
		// maxlength: 500,
	},
	imageCover: String,

	/* We want ot calculate ratingsAverage & ratingsQuantity from Review (reviews.rating) when review created/updated or deleted
			But How do we dot it ?
				- Simple, if we want to work with review, then we have to work with 'Review' Model means in reviewSchema in reviewModel.js

			How do we update Tour fields by reviewSchema ?
				- As we update Tour fields by tourController.js by importing, so we can import our schema into any file, even inside
					other schema.

			How do we get access Model inside .pre() or .post() ?
				. `this`` in pre() or post point to document/query on 'save'/'find' but
				. `this.constructor` point to document/query's parent, which is Model.

				details see on reviewModel.js
					1. handle all the logics inside hook, so that it run automatically before on every query
					2. import Tour model into reviewSchema, to use Tour's fields inside reviewSchema
					3. .statics. has access all the methods of Model.
					4. We can call .statics. methods inside pre()/post() via `this.constructor` [=== Model] which is model
	*/
	ratingsAverage: {
		type: Number,
		default: 0,
		set: val => val.toFixed(2) * 1 		// set to convert value, [Coercion to number back, toFixed return string]
	},
	ratingsQuantity: {
		type: Number,
		default: 0
	},

	images: [String],
	startDates: [Date],

	// CHILD REFERENCE: require a field of array,
	guides: [{                           // array of userIDs
		type: Schema.Types.ObjectId,       // make sure only get mongoDBID (24 char long hex string)
		ref: 'User'                        // Reference to User model, by ID ( guides[1]._id === User.find()[0]._id )
	}],

	// geo Special data
	locations: [{
		description: String,
		type: {
			type: String,
			default: 'Point'
		},
		coordinates: [Number],
		day: Number

	}],
	startLocation: {                  // we can use firstItem of locations, locations[1], or this ways seperately.
		type: {
			type: String,
			default: 'Point',             // It is a geoJSON data type, in MondoDB, It is not just 'text'
			enum: ['Point']               // only data type for neoJSON now allow Point
		},
		description: String,
		coordinates: [Number],
		address: String
	},

	secretTour: {
		type: Boolean,
		default: false
	}

}, {
	timestamps: true,
	toJSON: { virtuals: true },      // to show virtual property:   'durationWeek' 'reviews'
})

/* Improving Query Performance:
		- When we search for a query, MongoDB, try to match with every fields in every documents,
			which take so much time if collection is long, but we can only search by a specific field
			instead of whole document, by adding that field in index, MongoDB first looking for search
			indexes, then document's fields.

			.find().explain()             // executionStats, shows how many documents searches & fields
*/

// (6) tourSchema.index({ price: 1 })                  		// price will be added in index, 1 means search in ascending order
tourSchema.index({ price: 1, ratingsAverage: -1 })    // Compound index, no need to create indivisually
tourSchema.index({ slug: 1}) 													// because we query many time by this field to build page.
/* $ db.tours.getIndexes()         // to show all the index
	 . We can see index in MongoDB Compass, which has seperate tab for index.
*/

tourSchema.index({ startLocation: '2dsphere' }) 			// for GeoJSON index



// (3) add virtual property, which will not save in Database, will be exist in memory ans javascript variable do.
tourSchema.virtual('durationWeek').get(function(){
	return (this.duration / 7).toFixed(2) * 1   // toFixed() return string convert to number back by coercion
})


// (5) Our Goal: Get Reviews in every tour
/* To create virtual property  to create reference backward.  To creating 'TWO-WAY REFERENCING'
	 Some points to noticw:
		1. We are creating virtual fields on tourSchem schema, so tourSchem  must enable virtual fields. {toJSON: { virtuals: true }}
		2. define virtual property, and 2nd argument is the options, same as reguler fields have: { type, required, ... ref }
				.virtual('reviews', Options )
					1. 'ref'           : => point to Model to which it want to point to, reference to, connected to
					2. 'foreignField'  : => The Referenced Schema's field whch must be equal to
					3. 'localField'    : => to current Schema's field

		3. Must have to populate('reviews') if we want to get data back from other model. [actually it create new request]
				- We can not virtual populate on schema level, because that property is not availavle in schema [nor save in database]
					It create property on the fly (in memory) as like javascript object's property. Only be available when it combiled
					so we have to population on route controller [like: await Tour.findById(id).populate('reviews')]
					when it available to our code.
*/
tourSchema.virtual('reviews', {      // : create 'reviews' virtual field
	ref: 'Review',                     // : Make Reference to 'Review' Model
	foreignField: 'tour',              // : compare this field: reviewModel.tour   => tour._id
	localField: '_id'                  // : with this field   : tourSchema._id     => tour._id
})                                   // : virtuals: {true} => enabled virtual field,  & await Tour.findById(id).populate('reviews')
																		 //   make reviews field available to that route.



// (2) Document Middleware: To invoke ihis function, need to run   .save() | .create()
tourSchema.pre('save', function(next) {
	// will auto save with model's other fields
	this.slug = slugify(this.name, { lower: true }) // must pass 'slug' property in to schema, else it will be filter out.

	console.log( this.slug )
	next()                         // remember it is middleware so must move to next middleware
})


// (1) Query middleware: reading from database.   we can do any query method after `this` keyword, because `this === Query`
tourSchema.pre(/^find/, function(next) {
	// no need to await or return, because we modify object, not variable, and
	// objects are by reference means, any where change the object, will effect the same object or memory location.

	// this.find({ secretTour: { $ne: true } })
	// this.find({ secretTour: { $ne: true } }).populate('guides')
	this.find({ secretTour: { $ne: true } }).populate({
		path: 'guides',
		select: '-__v -createdAt -updatedAt',
		fields: 'name email'
	})
	next()
})


// // (4) : make private or secret route like this
// tourSchema.pre('aggregate', function(next) {
// 	 // this.pipeline()   => [ {...}, {...} ]
// 		// 	- return an array of all the block we make earlier in aggregat([{...}, {...}])

// 		//  so we have to add new stage before other stages, how do we do that ?
// 		// 	 - Don't worry so much, javascript arr.unshift({})   add {} object into array, in the beginning.
// 	this.pipeline().unshift({ $match: { secretTour: { $ne: true }} })
// 	next()
// })


module.exports = model('Tour', tourSchema)

