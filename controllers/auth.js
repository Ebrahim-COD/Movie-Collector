const bcrypt = require("bcrypt");
const User = require("../models/user.js");
require("dotenv").config();

const getSignup = (req, res) => {
  res.render("auth/sign-up.ejs");
};

const getSignin = (req, res) => {
  res.render("auth/sign-in.ejs");
};

const desSignup = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

const postSignup = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.status(400).send("User already exists");
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    let role = "user";

    if (
      req.body.username === process.env.ADMIN_USERNAME &&
      req.body.password === process.env.ADMIN_PASSWORD
    ) {
      role = "admin";
    }

    await User.create({
      username: req.body.username,
      password: hashedPassword,
      role: role,
    });

    res.redirect("/auth/sign-in");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error signing up! Please try again.");
  }
};

const postSignin = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.status(400).send("User does not exist");
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.status(400).send("Invalid password");
    }
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
      role: userInDatabase.role,
    };
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error signing in! Please try again.");
  }
};

module.exports = {
  getSignup,
  getSignin,
  desSignup,
  postSignup,
  postSignin,
};
