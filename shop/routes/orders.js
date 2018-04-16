const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'ok orders'
	});
});

router.post('/', (req, res, next) => {
	res.status(201).json({
		message: 'ok orders post'
	});
});

router.get('/:orderId', (req, res, next) => {
	const id = req.params.orderId;

	res.status(200).json({
		message: 'ok orders ' + id
	});
});

router.delete('/:orderId', (req, res, next) => {
	const id = req.params.orderId;
	
	res.status(200).json({
		message: 'ok orders delete' + id
	});
});

module.exports = router;