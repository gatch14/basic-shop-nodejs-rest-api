const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./shop/routes/products');
const orderRoutes = require('./shop/routes/orders');

mongoose.connect('mongodb://gatch-shop:' +
	process.env.MONGO_ATLAS_PASSWORD +
	'@api-shop-shard-00-00-0weol.mongodb.net:27017,api-shop-shard-00-01-0weol.mongodb.net:27017,api-shop-shard-00-02-0weol.mongodb.net:27017/test?ssl=true&replicaSet=api-shop-shard-0&authSource=admin'
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
		return res.status(200).json({});
	}
	next();
});

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