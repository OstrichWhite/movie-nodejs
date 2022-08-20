const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { protect } = require('../controllers/authController');

router
  .route('/')
  .get(getAllMovies)
  .post(protect, createMovie);
router
  .route('/:id')
  .get(getMovie)
  .patch(protect, updateMovie)
  .delete(protect, deleteMovie);

module.exports = router;
