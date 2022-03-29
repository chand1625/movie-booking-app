function checkAuthentication(req, res, next) {
  const uid = req.session.uid;
  const isAdmin = req.session.isAdmin;

  if (!uid) {
    return next();
  } else if (!isAdmin) {
    res.locals.uid = uid;
    res.locals.isAuth = true;
    next();
  } else {
    res.locals.uid = uid;
    res.locals.isAuth = true;
    res.locals.isAdmin = true;
    next();
  }
}

function checkAdminAuthorization(req, res, next) {
  if (!res.locals.isAdmin) {
    res.redirect("/");
    return;
  }
  next();
}

function checkUserAuthorization(req, res, next) {
  if (!res.locals.isAdmin && res.locals.isAuth) {
    next();
    return;
  }
  res.redirect("/");
  return;
}

module.exports = {
  checkAuthentication: checkAuthentication,
  checkAdminAuthorization: checkAdminAuthorization,
  checkUserAuthorization: checkUserAuthorization,
};
