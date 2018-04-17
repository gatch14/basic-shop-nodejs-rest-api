const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products');

router.get('/', (req, res, next) => {
	Product.find()
		.exec()
		.then(result => {
			console.log(result);
			if (result.length >= 0) {
				res.status(200).json(result);
			} else {
				res.status(404).json({
					message: "No product found"
				});
			}			
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

router.post('/', (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	});
	product
		.save()
		.then(result => {
			console.log(result);			
			res.status(201).json({
				message: 'post',
				createProduct: result
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.exec()
		.then(result => {
			console.log(result);
			if (result) {
				res.status(200).json(result);
			} else {
				res.status(404).json({message: 'invalid ID'});
			}
			
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

router.patch('/:productId', (req, res, next) => {
	const id = req.params.productId;
	
	const update = req.body;
	console.log(update);
	Product.update(
		{ 
			_id: id
		},
		{
			$set: update
		}
	)
	.exec()
	.then(result => {
		console.log(result);
		res.status(200).json(result)
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId;

	Product.remove({ _id: id})
		.exec()
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

module.exports = router;