const express = require('express')

const globalController = require('../controllers/globalController')



module.exports = (app) => {

  // global routeHandler for unknown routes
  app.all('*', globalController.globalRouteHandler )

  // Global Error handler
  app.use(globalController.globalErrorHandler)

  // Promise.reject(new Error('database connection failed'))
  // globalController.promiseHandler(app)     // Global handle promise Rejection: unhandledRejection
}
