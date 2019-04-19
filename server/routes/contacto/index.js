/* eslint-disable consistent-return */
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	auth: {
		user: process.env.MAILUSER,
		pass: process.env.MAILPASS
	}
});

module.exports = () => {
	router.get('/', (req, res, next) => {
		return res.render('contacto', { success: req.query.success, page: 'Contacto' });
	});

	router.post('/', [check('email').isEmail()], (req, res, next) => {
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
			from: `"Anais' website" <${process.env.MAILUSER}>`,
			to: 'anais.cisneros@insead.edu',
			subject: req.body.subject || '[No subject]',
			text: 'Hello world',
			html: output || '[No message]'
		};

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.render('contacto', { emailVal: false, page: 'contacto' });
		}

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) return res.status(500).send(err);
			console.log('Message sent: %s', info);
			return res.redirect('/contacto?success=true');
		});
	});
	return router;
};
