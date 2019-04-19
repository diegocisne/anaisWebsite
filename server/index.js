const express = require('express');
const createError = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const favicon = require('serve-favicon');
require('dotenv').config();

console.log(process.env.MAILUSER);

console.log(process.env.MAILPASS);

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');
if (app.get('env') === 'development') {
	app.locals.pretty = true;
}
app.set('views', path.join(__dirname, './views'));

const routes = require('./routes');

app.use(compression()); // Compress all routes

app.use(express.static('public'));

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.use(favicon(`/images/favicon.ico`));

app.use('/', routes());

app.use((req, res, next) => {
	return next(createError(404, 'File not found'));
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	const status = err.status || 500;
	res.locals.status = status;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(status);
	return res.render('error');
});
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`));

module.export = app;
