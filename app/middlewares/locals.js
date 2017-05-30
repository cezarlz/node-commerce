'use strict';

const pug = require('pug');
const moment = require('moment');
const path = require('path');
const url = require('url');

const plugins = {
  'jquery': ['jquery.js'],
  'bootstrap': ['bootstrap.css', 'bootstrap.js'],
  'wyswyg': ['summernote.css', 'summernote.js'],
  'multiselect': ['bootstrap-multiselect.css', 'bootstrap-multiselect.js'],
  'fileuploader': ['jquery.fileuploader.css', 'jquery.fileuploader.js']
};

module.exports = (req, res, next) => {
  const Helpers = {};

  Helpers.isHome = () => {
    return req.originalUrl.match(/^\/$/) !== null || req.originalUrl === ''
  };

  Helpers.isCheckout = () => {
    return req.originalUrl.match(/^\/checkout\/?$/) !== null;
  };

  Helpers.isCart = () => {
    return req.originalUrl.match(/^\/cart\/?$/) !== null;
  };

  Helpers.isProduct = () => {
    return req.originalUrl.match(/^\/product\/([a-z0-9-]{1,})\/?$/) !== null;
  };

  Helpers.isOrder = () => {
    return req.originalUrl.match(/^\/order\/([a-z0-9-]{1,})\/?$/) !== null;
  };

  Helpers.isPage = () => {
    return req.originalUrl.match(/^\/page\/([a-z0-9-]{1,})\/?$/) !== null;
  };

  Helpers.is404 = () => {
    return false;
  };

  Helpers.isAdmin = () => {
    return req.originalUrl.match(/^\/admin\/?/) !== null;
  };

  Helpers.isInstall = () => {
    return req.originalUrl.match(/^\/admin\/install\/?$/) !== null;
  };

  Helpers.isAssetRequest = () => {
    return req.originalUrl.match(/(\.css|\.js|\.jpe?g|\.png|\.webp|\.ico|\.mp?3?4|\.mpeg|\.avi|\.ogg|\.ogv)$/) !== null;
  };

  Helpers.adminMenuItem = (title, href, icon = 'pushpin') => {
    const url = req.originalUrl.split('/');
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

  Helpers.adminMenuDivider = () => {
    const menuDivider = `li.nav-divider`;

    return pug.render(menuDivider.trim());
  };

  Helpers.adminCategoriesList = (post) => {
    let categories = [];

    const createItem = (category) => {
      const link = `a(href="/admin/category/${category}").btn.btn-link.btn-xs ${category}`;

      return pug.render(link);
    };

    if (post.categories && post.categories.length) {
      categories = post.categories.map(category => createItem(category));
    }

    return categories.length ? categories.join(' | ') : '-';
  };

  Helpers.adminPagination = (data) => {
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

  Helpers.formatDate = (date, format = 'MM/DD/YYYY') => {
    let formatDate = moment(date);

    if (formatDate.isValid()) return formatDate.format(format);

    return 'Invalid date';
  };

  Helpers.loadCss = (file, path = '/admin/css', rel = 'stylesheet') => {
    const link = `link(href="${path}/${file}" rel="${rel}")`;

    return pug.render(link);
  };

  Helpers.loadJs = (file, path = '/admin/js', type = 'text/javascript') => {
    const link = `script(src="${path}/${file}" type="${type}")`;

    return pug.render(link);
  };

  Helpers.loadPlugin = (pluginName) => {
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
        files.css.push(Helpers.loadCss(file));
      }

      if (isJs) {
        files.js.push(Helpers.loadJs(file));
      }
    });

    return files;
  };

  Helpers.bodyClass = (className = []) => {
    const classes = [];

    if (Helpers.isHome()) classes.push('home');

    if (Helpers.is404()) classes.push('error404');

    if (Helpers.isAdmin()) classes.push('admin');

    if (Helpers.isCart()) classes.push('cart');

    if (Helpers.isCheckout()) classes.push('checkout');

    if (Helpers.isOrder()) classes.push('order');

    if (Helpers.isPage()) classes.push('page');

    if (Helpers.isProduct()) classes.push('product');

    if (Helpers.isInstall()) classes.push('install');

    return classes.concat(className).join(' ');
  };

  Helpers.homeUrl = () => {
    return url.format({
      protocol: req.protocol,
      host: req.get('host')
    });
  };

  Helpers.isSSL = () => {
    return req.protocol === 'https';
  };

  res.locals = Object.assign({}, res.locals, Helpers);

  next();
};