const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: "lockerit.sendiit@gmail.com", // generated ethereal user
		pass: "hotwwwwmnhwsddjn", // generated ethereal password
		// pass: "hotw wwwm nhws ddjn", // generated ethereal password
	},
});

const val = {
	/**
	 * 
	 * @param {string} email 
	
	 */
	// async..await is not allowed in global scope, must use a wrapper
	mailVerification: async (email, num) => {
		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: 'Lockerit!', // sender address
			to: email, // list of receivers
			subject: "Lockerit - Comprobación de correo electrónico", // Subject line
			text: num, // plain text body
			html: "Código de Verificación es : " + num ,
		});

		console.log("Message sent: %S", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		//console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

	},

	mailRecoverPassword: async (email, num) => {

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: 'Lockerit!', // sender address
			to: email, // list of receivers
			subject: "Lockerit - Cambio de contraseña", // Subject line
			text: num, // plain text body
			html: "Código de Verificación es : " + num ,
		});

		console.log("Message sent: %S", info.messageId);
	},
};

module.exports = val;
