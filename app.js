const express = require('express')
const requiredMiddlewares = require('./middlewares')
const app = express()


// middlewares  = require + router + globalErrorHandler + globalRouteHandler + promiseRejectionHandler
requiredMiddlewares( app )

// export app to /server.js so that 	const server = app.listen(..) can be done.
module.exports = app
