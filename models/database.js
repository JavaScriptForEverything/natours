/* Note:
    1. If total users less than   countDocuments()     then  { active: false } === by deleting user
    2. If total tours less than   countDocuments()     then  { secretTour: true } === by private tour


    -----------[ Common MongoDB command ]--------------
// show dbs
use natours

// show collections
// db.tours.find().pretty()
// db.tours.find().count()
db.tours.find({ secretTour: { $ne: true } }).count()
// db.tours.find({ secretTour: true }).count()
// db.tours.find({ secretTour: true }).pretty()
// db.tours.find({ secretTour: true }).pretty()
// db.tours.find({ duration: 7, difficulty: 'medium' }).pretty()
// db.tours.find({ name: /slug/i}, {name: 1, slug: 1, duration: 1 }).pretty()

// db.tours.updateMany({}, { $set: { secretTour: false }}).count()


// db.users.drop()
// db.users.updateMany({}, { $set: {active: true} })
// db.users.find().pretty()


// db.reviews.drop()
// db.reviews.find().pretty()
*/





const { connect } = require('mongoose')

const { DB_LOCAL_URL, DB_REMOTE_URL, NODE_ENV } = process.env
const DATABASE = NODE_ENV === 'production' ? DB_REMOTE_URL : DB_LOCAL_URL   

// export database
module.exports = () => connect( DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  // .then( con => console.log(`database [${con.connection.host}] is successful!!!`))
  // .catch(console.error)
