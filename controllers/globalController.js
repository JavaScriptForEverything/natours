const { appError } = require('../util')

// handle promise rejection
exports.promiseHandler = (server) => process.on('unhandledRejection', (err) => {
  let message = 'handle promize Rejection globally: '
      message += err.message
  console.log( message )

  // Give sometime to finish all the pending task, then close because of 'unhandledRejection'
  server.close( () => process.exit(1) )     // const server = app.listen(...),   [ app.close() => error ]
  // process.exit(1)
})

// global routeHandler for unknown routes
exports.globalRouteHandler = (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can't find ${req.originalUrl} on this server`
  // })
  next(appError(`Can't find ${req.originalUrl} on this server`))
}




// --------[ Global Error handler Section ]---------

const prodErrorHandler = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
  })
}

const devErrorHandler = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    error: err,
    stack: err.stack
  })
}


const dbInvalidIdErrorHandler = (error) => {
  // error.statusCode = 400
  // error.status = 'CastError'
  // error.message = `Invalid ID: ${error.value}`
  // return error
  return appError(`Invalid ID: ${error.value}`, 400, error.name)
}
const dbDuplicateErrorHandler = (error) => {
  return appError(`Duplicate Fields: ${error.message.split('index:').pop()}`, 400, error.name)
}
const handleValidationError = (errors) => {
  const message = Object.entries( errors ).map( ([key, value]) => `${key}: ${value.message}`)
  return appError(message, 400, 'ValidationError')
}

// throw expiresIn Error by: jwt.sign({id}, secret, { expires: '5s'})
const handleJsonWebTokenError = (error) => appError(error.message, 401, error.name)


exports.globalErrorHandler = (err, req, res, next) => {
  // console.log( err.name === 'CastError')


  if(err.name === 'CastError') err = dbInvalidIdErrorHandler( err )
  if(err.code === 11000) err = dbDuplicateErrorHandler( err )
  if(err.errors) err = handleValidationError( err.errors )

  if(err.name === 'JsonWebTokenError') err = handleJsonWebTokenError( err )
  if(err.name === 'TokenExpiredError') err = handleJsonWebTokenError( err )


  if( process.env.NODE_ENV !== 'production') return devErrorHandler(err, res)

  // err.message = 'updated message'
  prodErrorHandler(err, res)

}

