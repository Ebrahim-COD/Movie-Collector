const express = require("express");
const router = express.Router();
const upload = require('../config/multer');
const {
  getMovies,
  getNewmovies,
  addMovies,
  showMovies,
  deleteMovies,
  getEditMovies,
  updateMovies,
} = require("../controllers/movies");

router.route("/").get(getMovies); // Route to get all movies
router.route("/new").get(getNewmovies); // Route to display form for adding a new movie
router.route("/").post(upload.single('image'), addMovies);  //Route to handle form submission for adding a new movie with file upload
router.route("/:movieId").get(showMovies); // Route to get a specific movie
router.route("/:movieId").delete(deleteMovies); // Route to delete a specific movie
router.route("/:movieId/edit").get(getEditMovies);  // Route to display form for editing a specific movie
router.route("/:movieId").put(upload.single('image'), updateMovies); // Route to handle form submission for updating a specific movie (with file upload)

module.exports = router;  
