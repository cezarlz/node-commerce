'use strict';

const auth = function (role, redirect) {
  return function (req, res, next) {
    if (!req.session.user) return res.redirect('/admin/login?status=401');

    if (role && role !== req.session.user.role) return res.redirect(redirect || '/admin/login?status=403');

    next();
  }
};

module.exports = auth;