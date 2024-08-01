// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// Import required modules
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");

// Import custom modules
const isSignedIn = require("./middleware/is-signed-in");
const passUserToView = require("./middleware/pass-user-to-view");
const isAdmin = require("./middleware/is-admin");
require("./config/database");

// Create an Express application
const app = express();

// Set the port from environment variable or default to 7000
const port = process.env.PORT || "7000";

// Set up view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(methodOverride("_method")); // Use HTTP verbs such as PUT or DELETE
app.use(morgan("dev")); // Logging HTTP requests
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);
app.use(express.static("public")); // Serve static files

// Define routes
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

// Route handlers
app.use("/auth", require("./routes/UserRoutes"));
app.use("/users/:userId/movies", isSignedIn, require("./routes/MovieRoutes"));
app.use("/admin", isAdmin, require("./routes/AdminRoutes"));

// Start the server
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
