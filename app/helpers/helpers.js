'use strict';

module.exports = (req, res, next) => {
  const helpers = {
    isHome: function () {
      return req.path.match(/^\/$/) !== null;
    },
    isCheckout: function () {
      return req.path.match(/^\/checkout\/?$/) !== null;
    },
    isCart: function () {
      return req.path.match(/^\/cart\/?$/) !== null;
    },
    isProduct: function () {
      return req.path.match(/^\/product\/([a-z0-9-]{1,})\/?$/) !== null;
    },
    isOrder: function () {
      return req.path.match(/^\/order\/([a-z0-9-]{1,})\/?$/) !== null;
    },
    isPage: function () {
      return req.path.match(/^\/page\/([a-z0-9-]{1,})\/?$/) !== null;
    },
    is404: function () {
      return false;
    },
    isAdmin: function () {
      return req.path.match(/^\/nc\-admin\/?/) !== null;
    },
    isInstall: function () {
      return req.path.match(/^\/nc\-admin\/install\/?$/) !== null;
    },
    isAssetRequest: function () {
      return req.path.match(/(\.css|\.js|\.jpe?g|\.png|\.webp|\.ico|\.mp?3?4|\.mpeg|\.avi|\.ogg|\.ogv)$/) !== null;
    }
  };

  res.locals = Object.assign({}, res.locals, helpers);

  next();
};