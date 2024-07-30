const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
require("./config/database");
const isSignedIn = require("./middleware/is-signed-in");
const passUserToView = require("./middleware/pass-user-to-view");
const isAdmin = require("./middleware/is-admin");
// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "7000";

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);

app.use(express.static("public"));

app.get("/", (req, res) => {
  if (req.session.user) {
    if (req.session.user.role === "admin") {
      res.redirect("/admin");
    } else {
      res.redirect(`/users/${req.session.user._id}/movies`);
    }
  } else {
    res.render("index.ejs");
  }
});

app.use("/auth", require("./routes/UserRoutes"));
app.use("/users/:userId/movies", isSignedIn, require("./routes/MovieRoutes"));
app.use("/admin", isAdmin, require("./routes/AdminRoutes"));

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
