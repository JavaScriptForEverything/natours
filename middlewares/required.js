const express = require('express')
const cookieParser = require('cookie-parser')

const rateLimit = require('express-rate-limit')             // set limition on how many request can send from a single IP
const helmet = require('helmet')                            // add some common (8 headers) security header

// sanitization middleware must be bellow express.json() so that get data, nd sanitize that data.
const mongoSanitize = require('express-mongo-sanitize')     // Prevent NoSQL Query injection [ {"field": {"$gt": ""}} = always true ]
const xssClean = require('xss-clean')                       // Remove malicius code from user .html
const hpp = require('hpp')                                  // Remove duplicate query key=value, only the last pair will have




// requiredMiddlewares
module.exports = (app) => {
  app.use('/api', rateLimit({             // Only apply on our api, not on our webpage.
    max: 100,
    windowMs: 1000 * 60 * 60,             // 100/hours
    message: 'your IP cross the limitation or request'
  }))
  app.use(helmet())


  // Our Mandatory middlewares for our app (and others for security purpose)
  app.use( cookieParser() )
  app.use( express.json({ limit: '10kb' }) )        // Security: only 10kb data can get in server per request


  /* Data Sanitization: NoSQL Query Injection + XSS
  {
     "email" : {"$gt" : ""},   // <= "email" : "abc@gmail",     : login without email address to first email found in database
     "password" : "asdfasdf"
  }*/
  app.use(mongoSanitize())                          // sanitize after getting data  by express.json(),
  app.use(xssClean())                               //


  /* in our apiFeatures we made:    req.query.sort.split()
      it works file if we pass sort query once,  like:   ?sort=duration
      but if we pass that sort query more than 1, then express return array, instead of primitive value.

        ?sort=duration                =>   { sort: 'duration' }              : => premitive value
        ?sort=duration&sort=price     =>   { sort: ['duration', 'price'] }   : => array

    This phenomena happend by express on every query on repeating, so we have 2 ways to solve it
      1. We can build our apiFeatures by taking this phenomina in mind
      2. We can use a 3rd party module, which will automatically remove duplicate query, and only last query will be applied
          . if we use that module called hpp (HTTP Paramiter Polutions), then our old code works still fine.

    $ yarn add hpp
    const hpp = require('hpp')
    app.use( hpp() )                 : To Remove duplicate query key=value, only the last pair will have

      but sometime we need some properties to be repeated, like: /api/tours?duration=5&duration=7
      how do we do that ?
        - hpp() have options object and property 'whitelist: []'
  */

   // all the fields than can be repeatedly may used
  app.use( hpp({whitelist: ['duration', 'maxGroupSize', 'difficulty', 'price'] }))
}
