/* eslint-disable consistent-return */
const express = require('express');
const nodemailer = require('nodemailer');
const config = require('../../config/index.js');

const router = express.Router();

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	auth: {
		user: config.USER,
		pass: config.PASS
	}
});

module.exports = () => {
	router.get('/', (req, res, next) => {
		return res.render('contact', { success: req.query.success, page: 'Contacto' });
	});

	router.post('/', (req, res, next) => {
		console.log(req.body);

		const output = `
		<p>You have a new contact request</p>
		<h3>Contact details:</h3>
		<ul>
		<li>Name: ${req.body.name}</li>
		<li>Email: ${req.body.email}</li>
		</ul>
		<h3>Message:</h3>
		<p>${req.body.message}</p>
		`;

		const mailOptions = {
			from: `"Anais' website" <${config.USER}>`,
			to: 'diegocisneros059@gmail.com',
			subject: req.body.subject || '[No subject]',
			text: 'Hello world',
			html: output || '[No message]'
		};

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) return res.status(500).send(err);
			console.log('Message sent: %s', info);
			return res.redirect('/contact?success=true');
		});
	});
	return router;
};
