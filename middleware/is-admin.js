const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.status(403).send("Unauthorized: Admins only");
  }
};

module.exports = isAdmin;
