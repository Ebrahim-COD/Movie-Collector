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
    const user = await User.findById(req.params.id)
    res.render("admin/show.ejs", { user });
  }
  catch (error) {
    console.log(error);
    res.status(500).send("Error getting user");
  }
}

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting user");
  }
};

module.exports = {
  getUsers,
  showUser,
  deleteUser,
};
