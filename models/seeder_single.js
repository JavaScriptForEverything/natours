const { readFile } = require('fs/promises')
const { resolve } = require('path')

const tourFile = resolve(__dirname, '../dev-data/data/tours.json')
const tourJSON = readFile(tourFile, 'utf8')

require('dotenv').config()
require('./database')()

const Tour = require('./tourModel')



const catchAsync = (fn) => (data) => fn(data).catch(err => {
	console.error( err )
	process.exit(1)
})

const importData = catchAsync( async (json) => {
	let data = JSON.parse( await json )   		// convert to Object

	await Tour.deleteMany()
	await Tour.create( data )
	console.log('Data is successfull imported !!!')

	process.exit()
})


const deleteData = catchAsync(async () => {
	await Tour.deleteMany()
	console.log('Data is successfull deleted !!!')
	process.exit()
})


const readData = catchAsync(async () => {
	const tours = await Tour.find()
	console.log( tours )
	process.exit()
})

const argv = process.argv.pop()
if( argv === '--import' ) return importData( tourJSON )
if( argv === '--delete' ) return deleteData()
readData()


/*
For Local Database:
		$ node models/seeder.js --import 														: import into local database
		$ node models/seeder.js --delete 														: delete drom database
		$ node models/seeder.js          														: read from database

For Remote Database:
		$ NODE_ENV=production node models/seeder.js --import 				: import into remote database
		$ NODE_ENV=production node models/seeder.js --delete 				:
		$ NODE_ENV=production node models/seeder.js          				:
*/


