const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname﻿);
	}
});

const fileFilter = (req, file, cb) => {
	// reject file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		filesize: 1024* 1024 * 5
	},
	fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', (req, res, next) => {
	Product.find()
		.select('name price _id productImage')
		.exec()
		.then(result => {
			const response = {
				count: result.length,
				products: result.map(data => {
					return {
						name: data.name,
						price: data.price,
						_id: data._id,
						image: data.productImage,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/products/' + data._id
						}
					}
				})
			}
			if (result.length >= 0) {
				res.status(200).json(response);
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

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {

	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	});
	product
		.save()
		.then(result => {		
			res.status(201).json({
				message: 'Created product success',
				createProduct: {
					name: result.name,
					price: result.price,
					_id: result._id,
					request: {
						type: 'POST',
						url: 'http://localhost:3000/products/' + result._id
					}
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.select('name price _id productImage')
		.exec()
		.then(result => {
			if (result) {
				res.status(200).json({
					product: result,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/products/'
					}
				});
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

router.patch('/:productId', checkAuth, (req, res, next) => {
	const id = req.params.productId;	
	const update = req.body;

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
		res.status(200).json({
			message: 'Product updated',
			request: {
				type: 'GET',
				url: 'http://localhost:3000/products/' + id
			}
		})
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.delete('/:productId', checkAuth, (req, res, next) => {
	const id = req.params.productId;

	Product.remove({ _id: id})
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Product deleted'
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

module.exports = router;