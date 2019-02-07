module.exports = {
  userIsAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash('error_message', `You must be logged in to access that resource`);
    res.redirect('/auth/login');

  },

  userIsAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.is_admin) {
      return next();
    }

    req.flash('error_message', `Only admins can access that resource`);
    res.redirect('/auth/login');
  },
};
