const express = require("express");
const router = express.Router();
const {
  getMovies,
  getNewmovies,
  addMovies,
  showMovies,
  deleteMovies,
  getEditMovies,
  updateMovies,
} = require("../controllers/movies");

router.route("/").get(getMovies);
router.route("/new").get(getNewmovies);
router.route("/").post(addMovies);
router.route("/:movieId").get(showMovies);
router.route("/:movieId").delete(deleteMovies);
router.route("/:movieId/edit").get(getEditMovies);
router.route("/:movieId").put(updateMovies);

module.exports = router;
