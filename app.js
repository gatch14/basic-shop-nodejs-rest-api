const express = require('express');
const app = express();
const morgan = require('morgan');

const productRoutes = require('./shop/routes/products');
const orderRoutes = require('./shop/routes/orders');

app.use(morgan('dev'));

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;