
const userRouter = require('../routes/userRoute')
const tourRouter = require('../routes/tourRoute')
const reviewRouter = require('../routes/reviewRoute')

module.exports = (app) => {
  app.use('/api/users', userRouter)
  app.use('/api/tours', tourRouter)
  app.use('/api/reviews', reviewRouter)
}
