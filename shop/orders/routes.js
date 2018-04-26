const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('./controllers');

router.get('/', checkAuth, OrdersController.ordersGetAll);

router.post('/', checkAuth, OrdersController.ordersCreateOrder);

router.get('/:orderId', checkAuth, OrdersController.ordersGetOrder);

router.delete('/:orderId', checkAuth, OrdersController.ordersDeleteOrder);

module.exports = router;