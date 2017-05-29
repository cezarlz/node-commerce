'use strict';

const pug = require('pug');
const moment = require('moment');
const path = require('path');

const plugins = {
  'jquery': ['jquery.js'],
  'bootstrap': ['bootstrap.css', 'bootstrap.js'],
  'wyswyg': ['summernote.css', 'summernote.js'],
  'multiselect': ['bootstrap-multiselect.css', 'bootstrap-multiselect.js'],
  'fileuploader': ['jquery.fileuploader.css', 'jquery.fileuploader.js']
};

const Helpers = {};

Helpers.isHome = function (url) {
  return url.match(/^\/$/) !== null || url === ''
};

Helpers.isCheckout = function (url) {
  return url.match(/^\/checkout\/?$/) !== null;
};

Helpers.isCart = function (url) {
  return url.match(/^\/cart\/?$/) !== null;
};

Helpers.isProduct = function (url) {
  return url.match(/^\/product\/([a-z0-9-]{1,})\/?$/) !== null;
};

Helpers.isOrder = function (url) {
  return url.match(/^\/order\/([a-z0-9-]{1,})\/?$/) !== null;
};

Helpers.isPage = function (url) {
  return url.match(/^\/page\/([a-z0-9-]{1,})\/?$/) !== null;
};

Helpers.is404 = function (url) {
  return false;
};

Helpers.isAdmin = function (url) {
  return url.match(/^\/admin\/?/) !== null;
};

Helpers.isInstall = function (url) {
  return url.match(/^\/admin\/install\/?$/) !== null;
};

Helpers.isAssetRequest = function () {
  return url.match(/(\.css|\.js|\.jpe?g|\.png|\.webp|\.ico|\.mp?3?4|\.mpeg|\.avi|\.ogg|\.ogv)$/) !== null;
};

Helpers.adminMenuItem = function (title, href, icon = 'pushpin') {
  const url = this.req.originalUrl.split('/');
  const menu = href.split('/');

  const urlType = url[3] || url[2];
  const menuType = menu[3] || menu[2];

  const isActive = urlType === menuType;

  const menuItem = `
      li(class="${isActive ? 'active' : ''}")
        a(href="${href}")
          span(class="glyphicon glyphicon-${icon}")
          | ${title}
    `;

  return pug.render(menuItem.trim());
};

Helpers.adminMenuDivider = function () {
  const menuDivider = `li.nav-divider`;

  return pug.render(menuDivider.trim());
};

Helpers.adminCategoriesList = function (post) {
  let categories = [];

  const createItem = function (category) {
    const link = `a(href="/admin/category/${category}").btn.btn-link.btn-xs ${category}`;

    return pug.render(link);
  };

  if (post.categories && post.categories.length) {
    categories = post.categories.map(category => createItem(category));
  }

  return categories.length ? categories.join(' | ') : '-';
};

Helpers.adminPagination = function (data) {
  const pagination = `
      nav.nav-pager
        ul.pager
          li ${data.total} ${data.total === 1 ? 'item' : 'items'}
          li(class="${data.page === 1 ? 'disabled' : ''}")
            a(href="#") &larr; Previous
          li ${data.page} of ${data.pages}
          li(class="${data.page === data.pages ? 'disabled' : ''}")
            a(href="#") Next &rarr;
    `;

  const singlePagination = `
      nav.nav-pager
        ul.pager
          li ${data.total} ${data.total === 1 ? 'item' : 'items'}
    `;

  return data.docs.length ? pug.render((data.pages > 1 ? pagination : singlePagination).trim()) : null;
};

Helpers.formatDate = function (date, format = 'MM/DD/YYYY') {
  let formatDate = moment(date);

  if (formatDate.isValid()) return formatDate.format(format);

  return 'Invalid date';
};

Helpers.loadCss = function (file, path = '/admin/css', rel = 'stylesheet') {
  const link = `link(href="${path}/${file}" rel="${rel}")`;

  return pug.render(link);
};

Helpers.loadJs = function (file, path = '/admin/js', type = 'text/javascript') {
  const link = `script(src="${path}/${file}" type="${type}")`;

  return pug.render(link);
};

Helpers.loadPlugin = function (pluginName) {
  const plugin = plugins[pluginName];

  if (!plugin) return false;

  const files = {
    css: [],
    js: []
  };

  plugin.forEach(file => {
    const isCss = file.endsWith('.css');
    const isJs = file.endsWith('.js');

    if (isCss) {
      files.css.push(this.loadCss(file));
    }

    if (isJs) {
      files.js.push(this.loadJs(file));
    }
  });

  return files;
};

Helpers.bodyClass = function (className = []) {
  const classes = [];

  if (this.isHome()) classes.push('home');

  if (this.is404()) classes.push('error404');

  if (this.isAdmin()) classes.push('admin');

  if (this.isCart()) classes.push('cart');

  if (this.isCheckout()) classes.push('checkout');

  if (this.isOrder()) classes.push('order');

  if (this.isPage()) classes.push('page');

  if (this.isProduct()) classes.push('product');

  if (this.isInstall()) classes.push('install');

  return classes.concat(className).join(' ');
};

module.exports = Helpers;