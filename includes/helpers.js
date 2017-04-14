module.exports = (req, res, next) => {
  const helpers = {
    is_home: function () {
      return req.path.match(/^\/$/) !== null;
    },
    is_checkout: function () {
      return req.path.match(/^\/checkout\/?$/) !== null;
    },
    is_cart: function () {
      return req.path.match(/^\/cart\/?$/) !== null;
    },
    is_product: function () {
      return req.path.match(/^\/product\/([a-z0-9-]{1,})\/?$/) !== null;
    },
    is_order: function () {
      return req.path.match(/^\/order\/([a-z0-9-]{1,})\/?$/) !== null;
    },
    is_page: function () {
      return req.path.match(/^\/page\/([a-z0-9-]{1,})\/?$/) !== null;
    },
    is_404: function () {
      return false;
    },
    is_admin: function () {
      return req.path.match(/^\/nc\-admin/) !== null;
    },
    lower: function (text) {
      return text.toString().toLowerCase();
    },
    upper: function (text) {
      return text.toString().toUpperCase();
    }
  };

  res.locals = Object.assign({}, res.locals, helpers);

  next();
};