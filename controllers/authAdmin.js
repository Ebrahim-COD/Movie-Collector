const User = require("../models/user.js");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render("admin/index.ejs", { users });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting users");
  }
};

const showUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("admin/show.ejs", { user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting user");
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting user");
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    // Update the user's movies array by pulling out the movie with the given ID
    const result = await User.updateOne(
      { _id: userId, "movies._id": movieId },
      { $pull: { movies: { _id: movieId } } }
    );
    res.redirect(`/admin/${userId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting movie");
  }
};

module.exports = {
  getUsers,
  showUser,
  deleteUser,
  deleteMovie,
};
