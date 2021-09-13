const requiredMiddlewares = require('./required')
const routerMiddleware = require('./routerMiddleware')
const otherMiddleware = require('./othersMiddleware')

// module.exports = (app) => {
//   requiredMiddlewares(app)
//   routerMiddleware(app)
//   otherMiddleware(app)
// }

module.exports = (app) => {
  [
    requiredMiddlewares,                 // app.use( express.json()) ...
    routerMiddleware,                    // app.use('/api/v1/tours', tourRouter)....
    otherMiddleware,                     // no routes found, express global errorhandler, node promise unhandledRejection ..
  ].map( middleware => middleware(app))
}

