const User = require('../models/user.js');

const getMovies = async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const movies = currentUser.movies;
    res.render("movies/index.ejs", { movies });
  }
  catch (error) {
    console.log(error)
    res.status(500).send("Error getting movies! Please try again.")
    res.redirect("/")
  }
}

const getNewmovies = async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const movies = currentUser.movies;
        res.render("movies/new.ejs", { movies });
      }
      catch (error) {
        console.log(error)
        res.status(500).send("Error getting new movies! Please try again.")
        res.redirect("/")
      }
}

const addMovies = async (req, res) => {
    try {
        const watchedChoice = req.body.watched === "on" ? true : false;
        const currentUser = await User.findById(req.session.user._id);

        const newMovie = {
            title: req.body.title,
            director: req.body.director,
            genre: req.body.genre,
            year: req.body.year,
            watched: watchedChoice,
            user: req.session.user._id
        }
        currentUser.movies.push(newMovie);
        await currentUser.save();
        res.redirect(`/users/${req.session.user._id}/movies`)
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Error adding a new movie! Please try again.")
        res.redirect("/")
    }
}

const showMovies = async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const movieId = req.params.movieId;
        const movie = currentUser.movies.id(movieId);
        res.render("movies/show.ejs", { movie });
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Error showing movies! Please try again.")
        res.redirect("/")
    }
}

const deleteMovies = async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const movie = currentUser.movies.id(req.params.movieId);
        movie.deleteOne();
        await currentUser.save();
        res.redirect(`/users/${req.session.user._id}/movies`);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error deleting movies! Please try again.");
        res.redirect("/");
    }
}

const getEditMovies = async (req, res) => {
    try {
    const currentUser = await User.findById(req.session.user._id);  
    const movie = currentUser.movies.id(req.params.movieId);
    res.render("movies/edit.ejs", { movie });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error editing movies! Please try again.");
        res.redirect("/");
    }
}

const updateMovies = async (req, res) => {
    try {
        const watchedChoice = req.body.watched === "on" ? true : false;
        const currentUser = await User.findById(req.session.user._id);
        const movie = currentUser.movies.id(req.params.movieId);
        movie.set({
            title: req.body.title,
            director: req.body.director,
            genre: req.body.genre,
            year: req.body.year,
            watched: watchedChoice
        });
        
        await currentUser.save();
        res.redirect(`/users/${req.session.user._id}/movies/${req.params.movieId}`);
    }
    catch (error) {
        console.log(error)
        res.status(500).send("Error updating a movie! Please try again.")
        res.redirect("/")
    }
}
        

module.exports = {
    getMovies,
    getNewmovies,
    addMovies,
    showMovies,
    deleteMovies,
    getEditMovies,
    updateMovies
}