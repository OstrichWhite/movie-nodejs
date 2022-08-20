const express = require('express');
const router = express.Router();

const { toggleLike } = require('../controllers/likeController');
const { protect } = require('../controllers/authController');

router.route('/:id/toggle').post(protect, toggleLike);

module.exports = router;
