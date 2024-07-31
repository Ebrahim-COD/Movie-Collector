const express = require("express");
const router = express.Router();
const isSignedIn = require("../middleware/is-signed-in");
const isAdmin = require("../middleware/is-admin");
const { getUsers, showUser, deleteUser , deleteMovie} = require("../controllers/authAdmin");

router.route("/").get(isSignedIn, isAdmin, getUsers);
router.route("/:id").get(isSignedIn, isAdmin, showUser);
router.route("/:id").delete(isSignedIn, isAdmin, deleteUser);
router.route('/:userId/movies/:movieId').delete(isSignedIn, isAdmin, deleteMovie);

module.exports = router;
