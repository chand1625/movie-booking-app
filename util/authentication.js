function createUserSession(req, user, action) {
  req.session.uid = user.id.toString();
  if (user.is_admin) {
    req.session.isAdmin = true;
  }
  req.session.save(action);
}

function destroyUserAuthSession(req) {
  req.session.uid = null;
  req.session.isAdmin = null;
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
