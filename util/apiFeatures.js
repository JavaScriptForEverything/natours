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

   // all the fields than can be repeatedly may used
  app.use( hpp({whitelist: ['duration', 'maxGroupSize', 'difficulty', 'price'] }))

*/



const apiFeatures = (mongooseQuery, reqQuery) => {
  let query = mongooseQuery                    // Set default value which will be return
  let queryObject = { ...reqQuery }            // clone

  // |--------[ 0. Exclude Fields ]---------|
  let excludeFields = ['page', 'limit', 'sort', 'search', 'fields']
  Object.keys(queryObject).forEach( field => excludeFields.includes(field) && delete queryObject[field] )


  // |--------[ 1. Filter Documents ]---------|
  /* if we need to pass MongoDB operator, then put like:   name[$operator]=value => { name: {$operator: value} }

  Method-1:  duration=5              =>   { duration: '5' }
  Method-2:  duration[$gte]=5        =>   { duration: { $gte: '5' } }

     if put like:   name[operator]=value   then manully need to add '$'
         duration[gte]=5         =>   { duration: { gte: '5' } }

        queryString = JSON.stringify( queryObject )
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/i, match => `$${match}`)
        queryObject = JSON.parse( queryString )

  So which method we use, we must use method-1, Because, later we will use a 3rd party package 'express-mongo-sanitize'
    to prevent NoSQL attack, which will remove the speciality of '$' dollar sign, so if we use method-2, then
    our apiFeatures won't work, because $ will be converted into something else, so we not try to get dollar from user query,
    instead we add it manually in our code, so that it works into database
  */
  queryString = JSON.stringify( queryObject )
  queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/i, match => `$${match}`)
  queryObject = JSON.parse( queryString )
  // console.log( queryObject )
  query = query.find(queryObject)           // duration: '5',   coercion to   duration: 5   by .find()


  // |--------[ 2. Filter fields of a Document ]---------|
  const filter = function() {                           //   /api/tours?fields=name,ratingsQuantity,duration
    let fields = reqQuery.fields?.split(',').join(' ')

    this.query = this.query.select( fields )
    return this
  }

  // |--------[ 3. sort Documents ]---------|
  const sort = function() {                           //   /api/tours?sort=price,-ratingsAverage
    let sortStr = reqQuery.sort?.split(',').join(' ')
        sortStr = sortStr || 'price -ratingsAverage'        // By default sort by price=ascending and rating=descending order
        // or sort by createdAt in descanding order

    this.query = this.query.sort(sortStr)
    return this
  }

  // |--------[ 4. Pagination ]---------|
  const pagination = function() {
    let { page=1, limit=4 } = reqQuery
        page  = page * 1                 // Coercion to Number
        limit = limit * 1                // Coercion to Number

    const skip = (page - 1) * limit      // lastPage * limit
    this.query = this.query.skip(skip).limit(limit)

    return this
  }

  // |--------[ 5. search ]---------|
  const search = function() {
    let obj = reqQuery.search
        obj = { name: new RegExp(obj, 'i') } || {}          // object or empty object
        // obj = { slug: new RegExp(obj, 'i') } || {}       // use slug instead of name

    // this.query = this.query.find({...name})              // empty object or single object, not object inside object
    this.query = this.query.find(obj)                       // or Simple way

    return this
  }


  return {
    query,
    filter,
    sort,
    pagination,
    search
  }
}

module.exports = apiFeatures
