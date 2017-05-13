'use strict';

const Helpers = require('../helpers/helpers');

module.exports = (req, res, next) => {
  const helpers = new Helpers(req, res);

  res.locals = Object.assign({}, res.locals, {
    isHome: helpers.isHome.bind(helpers),
    is404: helpers.is404.bind(helpers),
    isAdmin: helpers.isAdmin.bind(helpers),
    isAssetRequest: helpers.isAssetRequest.bind(helpers),
    isCart: helpers.isCart.bind(helpers),
    isCheckout: helpers.isCheckout.bind(helpers),
    isOrder: helpers.isOrder.bind(helpers),
    isPage: helpers.isPage.bind(helpers),
    isProduct: helpers.isProduct.bind(helpers),
    isInstall: helpers.isInstall.bind(helpers),
    adminMenuItem: helpers.adminMenuItem.bind(helpers),
    adminMenuDivider: helpers.adminMenuDivider.bind(helpers),
    adminCategoriesList: helpers.adminCategoriesList.bind(helpers),
    bodyClass: helpers.bodyClass.bind(helpers),
    adminPagination: helpers.adminPagination.bind(helpers),
    formatDate: helpers.formatDate.bind(helpers),
    loadCss: helpers.loadCss.bind(helpers),
    loadJs: helpers.loadJs.bind(helpers),
    loadPlugin: helpers.loadPlugin.bind(helpers)
  });

  next();
};