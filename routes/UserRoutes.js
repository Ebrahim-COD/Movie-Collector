const express = require("express");
const router = express.Router();
const { getSignin, getSignup, desSignup, postSignup, postSignin } = require("../controllers/auth");

router.route("/sign-up").get(getSignup);
router.route("/sign-in").get(getSignin);
router.route("/sign-out").get(desSignup);
router.route("/sign-up").post(postSignup);
router.route("/sign-in").post(postSignin);


module.exports = router;
