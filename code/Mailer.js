const nodemailer = require("nodemailer");

const val = {
	/**
	 * 
	 * @param {string} email 
	
	 */
	// async..await is not allowed in global scope, must use a wrapper
	mailVerification: async (email, num) => {
		let link = 'http://localhost:3001/activacion/' + num
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: "lockeysendiit@gmail.com", // generated ethereal user
				pass: "uryvmcthzjrbeung", // generated ethereal password
			},
		});

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: 'Lockerit! . <lockerit.sendiit@gmail.com>', // sender address
			to: email, // list of receivers
			subject: "Lockerit - Código de Verificación", // Subject line
			text: link, // plain text body
			html: "URL de Verificación es : <a href='" + link + "'> " + link + "</a>",
		});

		console.log("Message sent: %S", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		//console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

	},
};

module.exports = val;
