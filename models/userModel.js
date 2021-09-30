const crypto = require('crypto')
const { Schema, model } = require('mongoose')
const { isEmail } = require('validator')
const { hash, compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		lowercase: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
		validate: isEmail
	},
	password: {
		type: String,
		required: true,
		minlength: 4,
		maxlength: 32,
		select: false
	},
	confirmPassword: { 							// only to confirm that, password is that password, which user wanted to, by twice input
		type: String,
		required: true,
		validate: function(value) { 	// only work on .create() save(), not for findByIdAndUpdate()...
			return this.password === value
		}
	},
	currentPassword: String, 				// to update user password
	passwordChangedAt: Date, 				// required to check is user update password after login or not
	passwordResetToken: String,
	passwordResetTokenExpires: Date,

	photo: {
		type: String,
		default: 'default.jpg'
	},
	role: { 												// Don't Allow user to update this property (Only admin allow it)
		type: String,
		enum: ['admin', 'user', 'guide', 'lead-guide'],
		default: 'user',
		trim: true
	},
	active: { 											// if need to delete user, don't delete, just make 	{ active : false }
		type: Boolean,
		default: true,
		select: false, 								// Hide it, so that reguler user don't know what is going on behind the scane
	}

},{
	timestamps: true
})


userSchema.pre('save', async function(next) {
	if(!this.isModified('password')) return 					// not hash on every update, only hash if password field update

	this.password = await hash(this.password, 12)
	this.confirmPassword = undefined
	next()
})
// userSchema.pre(/^find/, function(next) {
// 	this.select('-__v -createdAt -updatedAt')
// 	next()
// })
userSchema.pre(/^find/, function(next) {
	// this.select('-__v -createdAt -updatedAt') 				// comment it so that we can use apiFeatures include fields only-
	this.find({ active: { $ne : false } }) 							// ... else it shows projection can not use include and exclude
	next()
})




	// if res only then send cookey else get token only
userSchema.methods.getTokenAndSendCookie = function(res) {
	// return sign({_id: this._id}, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES } )
	const token = sign({_id: this._id}, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES } )

	res && res.cookie('token', token, {
		expires: new Date( Date.now() + 7 * 24 * 60 * 60 * 1000),
		// expires: new Date( Date.now() +  10 * 1000), 			// when cookie expire it, automatically remove cookie
		httpOnly: true, 																			// only HTTP Protocole allow
		secure: process.env.NODE_ENV === 'production', 				// only HTTPS method allow
	})

	return token
}

userSchema.methods.comparePassword = async function(userPassword) {
	return await compare(userPassword, this.password)
}

userSchema.methods.isPasswordChanged = function(loginTime) {
	/*iat          : loginTime, comes from token
    changeTime   : password update time, comes from psswordChangedAt property, A Date, update on every password update time.

    loginTime < passwordUpdateTime
      => true     == means login before password update,   : means need to login again with new crediential
      => false    == means login after password update,    : means no problems carry on. */
	const passwordUpdateTime = this.passwordChangedAt?.getTime() / 1000
  return loginTime < passwordUpdateTime
}

userSchema.methods.createPasswordResetToken = async function() {

	// --------[ Method-1: By regular crypto package ]----------
	const resetToken = crypto.randomBytes(32).toString('hex')

	// save the hashed version in database, and return unhashed, so that hash it again then compare it
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	this.passwordResetTokenExpires = Date.now() + 1000 * 60 * 10 	// now + 10 Minure
	await this.save({ validateBeforeSave: false })

	// return to unhashed version to user, which will be send via email (securely)
	return resetToken

	// --------[ Method-2: By bcryptjs package ]----------
	// const token = sign({_id: this._id}, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES } )

	// this.passwordResetToken = token
	// this.passwordResetTokenExpires = Date.now() + 1000 * 60 * 10 	// now + 10 Minure
	// await this.save({ validateBeforeSave: false })

	// return token
}


// user there is no instance of user, can add method in userModel by statics object
userSchema.statics.createHash = function(resetToken) {
	return crypto.createHash('sha256').update(resetToken).digest('hex')
}

userSchema.methods.passwordResetHandler = async function(password, confirmPassword) {
	/* if expire date is not bigger than current time, that means time expires
			We can it in 2 ways:
				1. when we query 	: 	await User.findOne({ passwordResetToken: resetToken, passwordResetTokenExpires: {$gt: Date.now()} })
				2. const isExpires = new Date(this.passwordResetTokenExpires) < new Date()
	*/
	if( new Date(this.passwordResetTokenExpires) < new Date() ) return false


	this.passwordResetToken = undefined
	this.passwordResetTokenExpires = undefined

	/* Must need to update passwordChangedAt property, so that password changed after login or not, can be chedked
			We can it also in 2 ways/place:
				1. here like this 	:	this.passwordChangedAt = new Date()
				2. in middleware 		:

				.pre('save', function() {
					if( !this.isModified('password') ) return
					this.passwordChangedAt: new Date();
					next()
				})
						. middleware is the parject place for this job, because it run everytime automatically without any warry.
							but because it is only need to update once, so method (1) is ok too */
	this.passwordChangedAt = new Date()

	this.password = password
	this.confirmPassword = confirmPassword
	await this.save() 												// it will check password validation, so don't trun off validation


	// console.log( this.constructor )

	this.password = undefined 									// don't show password
	this.confirmPassword = undefined
	return this
}

userSchema.methods.handleUpdatePassword = async function(password, confirmPassword) {
  this.password = password,
  this.confirmPassword = confirmPassword

	this.passwordChangedAt = new Date() 			// we update the password, so alse need to update it.
  await this.save()
}


module.exports = model('User', userSchema)
