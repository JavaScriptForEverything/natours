// we can seed all 3 dataset, tours, users, and reviews
// 		1. When we seed user make sure password validation turn off, 	.create(obj, { validateBeforeSave: false })
// 		2. make sure turn off password hash on save, because our password is already hashed

const { readFileSync } = require('fs')
const { resolve } = require('path')

let tours 	= readFileSync(resolve(__dirname, '../dev-data/data/tours.json'), 'utf8')
let users 	= readFileSync(resolve(__dirname, '../dev-data/data/users.json'), 'utf8')
let reviews = readFileSync(resolve(__dirname, '../dev-data/data/reviews.json'), 'utf8')

		tours 	= JSON.parse( tours )
		users 	= JSON.parse( users )
		reviews = JSON.parse( reviews )



require('dotenv').config()
require('./database')()

const Tour = require('./tourModel')
const User = require('./userModel')
const Review = require('./reviewModel')



const catchAsync = (fn) => (data) => fn(data).catch(err => {
	console.error( err )
	process.exit(1)
})

const importData = catchAsync( async () => {

	await Tour.deleteMany()
	await Tour.create( tours, { validateBeforeSave: false } ) 							// (1) : disable validation

	await User.deleteMany()
	await User.create( users, { validateBeforeSave: false } )

	await Review.deleteMany()
	await Review.create( reviews, { validateBeforeSave: false } )
	console.log('Data is successfull imported !!!')

	process.exit()
})


const deleteData = catchAsync(async () => {
	await Tour.deleteMany()
	await User.deleteMany()
	await Review.deleteMany()
	console.log('Data is successfull deleted !!!')
	process.exit()
})


const readData = catchAsync(async () => {
	const tours = await Tour.find()
	const user = await User.find()
	const reviews = await Review.find()
	console.log({ tours, users, reviews })
	process.exit()
})

const argv = process.argv.pop()
if( argv === '--import' ) return importData()
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


