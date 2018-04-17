const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
	Order.find()
		.select('product quantity _id')
		.populate('product')
		.exec()
		.then(result => {
			res.status(200).json({
				count: result.length,
				orders: result.map(data => {
					return {
						_id: data._id,
						product: data.product,
						quantity: data.quantity,
						url: 'http://localhost:3000/orders/' + data._id
					}
				})
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

router.post('/', (req, res, next) => {
	Product.findById(req.body.productId)
		.then(product => {
			if (!product) {
				return res.status(404).json({
					message: 'Product not found'
				});
			}
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				product: req.body.productId,
				quantity: req.body.quantity
			});
			return order.save();
		})
		.then(result => {
			res.status(201).json({
				message: 'Order created',
				order: {
					_id: result._id,
					product: result.product,
					quantity: result.quantity
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

router.get('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	Order.findById(id)
		.exec()
		.then(result => {
			if (!result) {
				return res.status(404).json({
					message: 'No order found'
				})
			}
			res.status(200).json({
				order: result
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

router.delete('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	Order.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Order deleted'
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

module.exports = router;