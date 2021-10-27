const { Router } = require('express')
const {
  getTours,
  getTour,
  getTourBySlug,
  addTour,
  updateTour,
  deleteTour,
  getTourStaticties,
  getTourMonthlyPlan,
  getToursWithIn,
  getToursDistances
} = require('../controllers/tourController')

const { protect, restrictTo } = require('../controllers/authController')
const reviewRouter = require('../routes/reviewRoute')
const { checkObjectId } = require('../controllers/reviewController')



module.exports = router = Router()

// // param middleware
// router.param('id', (req, res, next, value) => {
//   console.log({value})

//   next()
// })


/* . Regular user only have read permission, should not' allow to create, update or delete tours

   We can protect or restrict any route 2 ways:
     1. router.route('/').post(protect, restrictTo('admin, lead-guide'), addTour)

     But we we need to protect multiple route, instead adding protect & restrictTo middleware one by one,
     Whe have better way to do this

     2. router.use(protect, restrictTo('admin, lead-guide'))       // all the route bellow this is protected & restricted
        router.route('/').post(addTour)
        router.route('/:id')
          .patch(updateTour)
          .delete(deleteTour)
*/







// must before /:id tlse it try to match with that.
router.route('/tour-stats').get(getTourStaticties)
router.route('/tour-monthly-plan/:year').get(getTourMonthlyPlan)




// Working with GeoLocation Data
// /api/tours/tours-within/23/center/32,453/unit/mi               : it is clear way then
// /api/tours/tours-within?distance=23&center=32,453&unit=mi      : this way
router.route('/tours-within/:distance/center/:latlong/unit/:unit').get(getToursWithIn)
router.route('/distances/:latlong/unit/:unit').get(getToursDistances)



router.route('/tour/:slug').get(getTourBySlug)


//   /api/tours
router.route('/')
  .get(getTours)
  .post(protect, restrictTo('admin', 'lead-guide'), addTour)     // Regular user should n't allow to create Tour



//   /api/tours/:id
router.route('/:id')
  // .get(getTourBySlug)
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)



/* ---------[ Nested Routes ]----------------
    . /api/reviews   => to bello route

        . /api/tours/61322bf33f4f3f2464660e98/reviews
        . /api/tours/61322bf33f4f3f2464660e98/reviews/61322bf33f4f3f2464660e98

  Why we need nested Route ?
    - Because, to create review we need 2 things:
        1. userId   : which will comes from   protect middleware
        2. tourId   : that's the reason we need to create review in such a way, so that we have tourId available.

        we knows to add protect middleware before Router middleware to get userId, but how do we pass previous router params
        (reviewRoute.js) router = Router({ mergeParams: true })    // Will merge previous router params, with reviews router's params
*/
router.use(
  '/:tourId/reviews',           // => add tourId   <= req.params.tourId  <=  /api/tours/tourId/reviews
  protect,                      // => add userId   <= req.user._id
  restrictTo('user'),           // => { role: user } can add review       : only Regular user {role:'user'} can add review
  checkObjectId,                // => check tourId is valid or not
  reviewRouter                  // => Redirect   /api/tours/tourId/reviews ==> app.use('/api/reviews', reviewRouter)
)

/* Remember now app.use('/api/reviews', reviewRouter) is no longer need for API,
  but it is still usable in unprotected, un restricted, and alse have to pass tourId & userId
*/
