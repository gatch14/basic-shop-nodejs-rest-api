const express = require('express');
const app = express();

const productRoutes = require('./shop/routes/products');
const orderRoutes = require('./shop/routes/orders');

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

module.exports = app;