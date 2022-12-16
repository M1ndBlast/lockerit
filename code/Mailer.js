const nodemailer = require("nodemailer");

const val = {
	/**
	 * 
	 * @param {string} email 
	
	 */
	// async..await is not allowed in global scope, must use a wrapper
	mailVerification: async (email, num) => {
		var b = num.toString();
		console.log(b);
		console.log(email);
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: "smtp-mail.outlook.com",
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: "faragong23@outlook.com", // generated ethereal user
				pass: ".Faragon", // generated ethereal password
			},
		});

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: '"Lockerit-Envios" ', // sender address
			to: email, // list of receivers
			subject: "Lockerit - Código de Verificación", // Subject line
			text: b, // plain text body
			html: "Código de Verificación es : <b>" + b + "</b>",
		});

		console.log("Message sent: %S", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		//console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

	},
};

module.exports = val;
