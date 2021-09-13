const { appError, catchAsync, apiFeatures } = require('../util')


// Note: change every tour review... with doc variable that's it


exports.getAll = (Model) => catchAsync(async (req, res, next) => {

  //  // it should works on reviews but not, I don't know why, seams everything is Ok
	const filter = req.params.tourId ? { tour: req.params.tourId } : {}

  let doc = apiFeatures(Model.find(filter), req.query)
  doc = await doc.pagination().filter().sort().search().query

  // // To Test: Query Performance to check query searches: How many query match to get search result
  // doc = await doc.pagination().filter().sort().search().query.explain()

  const countDocuments = await Model.countDocuments()

  res.status(200).json({
    status: 'success',
    totalDocument: countDocuments,
    count: doc.length,
    data: doc
  })
})













exports.getById = (Model, populateOptions) => catchAsync( async (req, res, next) => {
  const { id } = req.params

  // let tour = Model.findById(id)
  //     tour =  reviews ? tour.populate('reviews') : tour
  //     tour = await tour

  let Query = Model.findById(id)
  if(populateOptions) Query = Query.populate(populateOptions)
  const doc = await Query

  if( !doc ) return next(appError(`No document found by id: ${id}`))

  res.status(200).json({
    status: 'success',
    data: doc
  })
})


exports.createOne = (Model) => catchAsync( async (req, res, next) => {
  const tour = await Model.create(req.body)

  res.status(201).json({
    status: 'success',
    data: tour
  })
})



exports.updateOne = (Model) => catchAsync( async (req, res, next) => {
  const { id } = req.params

  const tour = await Model.findById(id)
  if(!tour) return next(appError('No Document found'))

  const newTour = await Model.findByIdAndUpdate( id, req.body, { new: true, runValidators: true })

  res.status(201).json({
    status: 'success',
    data: newTour
  })
})


exports.deleteOne = (Model) => catchAsync( async (req, res, next) => {
  const { id } = req.params

  const tour = await Model.findById(id)
  if(!tour) return next(appError('No Document found'))

   await Model.findByIdAndDelete( id )

  res.status(204).json({
    status: 'success',
    data: tour
  })
})
