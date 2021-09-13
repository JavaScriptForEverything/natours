exports.apiFeatures = require('./apiFeatures')
exports.sendMail = require('./nodeMailer')

exports.appError = (message, statusCode=404, status) => {
  const err = new Error(message)
  err.status = status || (`${statusCode}`.startsWith(4) ? 'failed' : 'error')
  err.statusCode = statusCode 
  err.isOperational = true

  return err
}

exports.catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch( next )


