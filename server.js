require('dotenv').config()
const database = require('./models/database')
const app = require('./app')
const { promiseHandler } = require('./controllers/globalController')

const PORT = process.env.PORT || 5000


const server = app.listen(PORT, async(err) => {
  // if this line can't connect to database then next lines of code won't execute, and throw promise reject
  //    which handled by global promise rejection handler.
  const { connection } = await database()
  if( err ) throw new Error(err)

  let message = `Server running on port: ${PORT} `
      message += `& database: [${connection.host}] successful !!!`

  console.log(message)
})

// to close app on database connection or other rejection failed,
promiseHandler( server )




