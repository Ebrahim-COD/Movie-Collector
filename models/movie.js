const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    director: {
        type: String,
        require: true,
    },
    genre: {
        type: String,
        require: true,
    },
    year: {
        type: Number,
        require: true,
    }
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;