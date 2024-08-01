const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const upload = require("../config/multer");

// Controller methods

const getMovies = async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const movies = currentUser.movies;
    res.render("movies/index", { movies });
  } catch (error) {
    console.error("Error getting movies:", error);
    res.status(500).send("Error getting movies! Please try again.");
  }
};

const getNewmovies = (req, res) => {
  res.render("movies/new");
};

const addMovies = async (req, res) => {
  try {
    const { title, director, genre, year, watched } = req.body;
    const watchedChoice = watched === "on";
    const currentUser = await User.findById(req.session.user._id);

    const newMovie = {
      title,
      director,
      genre,
      year,
      watched: watchedChoice,
      user: req.session.user._id,
    };

    // Handle file upload
    if (req.file) {
      const imagePath = req.file.path;

      // Save image path locally
      newMovie.image = req.file.filename; // Save only the filename or relative path

      currentUser.movies.push(newMovie);
      await currentUser.save();
      res.redirect(`/users/${req.session.user._id}/movies`);
    } else {
      currentUser.movies.push(newMovie);
      await currentUser.save();
      res.redirect(`/users/${req.session.user._id}/movies`);
    }
  } catch (error) {
    console.error("Error adding a new movie:", error);
    res.status(500).send("Error adding a new movie! Please try again.");
  }
};

const showMovies = async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const movieId = req.params.movieId;
    const movie = currentUser.movies.id(movieId);
    res.render("movies/show", { movie });
  } catch (error) {
    console.error("Error showing movie:", error);
    res.status(500).send("Error showing movie! Please try again.");
  }
};

const deleteMovies = async (req, res) => {
  try {
    // Find the current user
    const currentUser = await User.findById(req.session.user._id);

    // Find the movie to delete
    const movie = currentUser.movies.id(req.params.movieId);

    // Optionally delete image file from server
    if (movie.image) {
      const imagePath = path.join("public", "uploads", movie.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Remove the movie
    movie.deleteOne();

    // Save the user document
    await currentUser.save();
    res.redirect(`/users/${req.session.user._id}/movies`);
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).send("Error deleting movie! Please try again.");
  }
};

const getEditMovies = async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const movie = currentUser.movies.id(req.params.movieId);
    res.render("movies/edit", { movie });
  } catch (error) {
    console.error("Error getting movie for edit:", error);
    res.status(500).send("Error getting movie for edit! Please try again.");
  }
};

const updateMovies = async (req, res) => {
  try {
    const { title, director, genre, year, watched } = req.body;
    const watchedChoice = watched === "on";
    const currentUser = await User.findById(req.session.user._id);
    const movie = currentUser.movies.id(req.params.movieId);

    if (!movie) return res.status(404).send("Movie not found");

    movie.title = title;
    movie.director = director;
    movie.genre = genre;
    movie.year = year;
    movie.watched = watchedChoice;

    if (req.file) {
      movie.image = req.file.filename;
    }

    await currentUser.save();
    res.redirect(`/users/${req.session.user._id}/movies/${req.params.movieId}`);
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).send("Error updating movie! Please try again.");
  }
};

// Export functions
module.exports = {
  getMovies,
  getNewmovies,
  addMovies,
  showMovies,
  deleteMovies,
  getEditMovies,
  updateMovies,
};
