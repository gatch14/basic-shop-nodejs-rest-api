const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'ok'
	});
});

router.post('/', (req, res, next) => {
	res.status(201).json({
		message: 'post'
	});
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;

	res.status(200).json({
		message: 'ok ' + id
	});
});

router.patch('/:productId', (req, res, next) => {
	const id = req.params.productId;

	res.status(200).json({
		message: 'ok patch ' + id
	});
});

router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId;

	res.status(200).json({
		message: 'ok delete ' + id
	});
});

module.exports = router;