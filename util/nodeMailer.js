const { createTransport } = require('nodemailer')


module.exports = async ({
	from='<robitops10@gmail.com>',  											// from the application
	to='',  																							// to sender email
	subject='password-reset(only valid for 10 minutes)',  //
	text='default message' 																//
} = {}) => {

	const transporter = createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS,
		}
	})

	await transporter.sendMail({from, to, subject, text})
}
