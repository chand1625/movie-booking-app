function checkAuthorization(req, res, next) {
  if (res.locals.isAdmin) {
    res.redirect("/dashboard");
  } else if (res.locals.isAuth) {
    res.redirect("/explore");
  } else {
    next();
  }
}

function getHome(req, res) {
  res.render("./shared/home.ejs");
}

function getDashboard(req, res) {
  res.render("./admin/dashboard");
}

module.exports = {
  getHome: getHome,
  getDashboard: getDashboard,
  checkAuthorization: checkAuthorization,
};
