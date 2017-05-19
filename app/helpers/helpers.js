'use strict';

const pug = require('pug');
const moment = require('moment');
const path = require('path');

class Helpers {
  constructor(req, res) {
    this._req = req;
    this._res = res;

    this._plugins = {
      'jquery': ['jquery.js'],
      'bootstrap': ['bootstrap.css', 'bootstrap.js'],
      'wyswyg': ['summernote.css', 'summernote.js'],
      'multiselect': ['bootstrap-multiselect.css', 'bootstrap-multiselect.js'],
      'fileuploader': ['jquery.fileuploader.css', 'jquery.fileuploader.js']
    };
  }

  get req() {
    return this._req;
  }

  get res() {
    return this._res;
  }

  get plugins() {
    return this._plugins;
  }

  isHome() {
    return this.req.originalUrl.match(/^\/$/) !== null || this.req.originalUrl === ''
  }

  isCheckout() {
    return this.req.originalUrl.match(/^\/checkout\/?$/) !== null;
  }

  isCart() {
    return this.req.originalUrl.match(/^\/cart\/?$/) !== null;
  }

  isProduct() {
    return this.req.originalUrl.match(/^\/product\/([a-z0-9-]{1,})\/?$/) !== null;
  }

  isOrder() {
    return this.req.originalUrl.match(/^\/order\/([a-z0-9-]{1,})\/?$/) !== null;
  }

  isPage() {
    return this.req.originalUrl.match(/^\/page\/([a-z0-9-]{1,})\/?$/) !== null;
  }

  is404() {
    return false;
  }

  isAdmin() {
    return this.req.originalUrl.match(/^\/admin\/?/) !== null;
  }

  isInstall() {
    return this.req.originalUrl.match(/^\/admin\/install\/?$/) !== null;
  }

  isAssetRequest() {
    return this.req.originalUrl.match(/(\.css|\.js|\.jpe?g|\.png|\.webp|\.ico|\.mp?3?4|\.mpeg|\.avi|\.ogg|\.ogv)$/) !== null;
  }

  adminMenuItem(title, href, icon = 'pushpin') {
    const isActive = this.req.originalUrl === href;

    const menuItem = `
      li(class="${isActive ? 'active' : ''}")
        a(href="${href}")
          span(class="glyphicon glyphicon-${icon}")
          | ${title}
    `;

    return pug.render(menuItem.trim());
  }

  adminMenuDivider() {
    const menuDivider = `li.nav-divider`;

    return pug.render(menuDivider.trim());
  }

  adminCategoriesList(post) {
    let categories = [];

    const createItem = function (category) {
      const link = `a(href="/admin/category/${category}").btn.btn-link.btn-xs ${category}`;

      return pug.render(link);
    };

    if (post.categories && post.categories.length) {
      categories = post.categories.map(category => createItem(category));
    }

    return categories.length ? categories.join(' | ') : '-';
  }

  adminPagination(data) {
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
  }

  formatDate(date, format = 'MM/DD/YYYY') {
    let formatDate = moment(date);

    if (formatDate.isValid()) return formatDate.format(format);

    return 'Invalid date';
  }

  loadCss(file, path = '/admin/css', rel = 'stylesheet') {
    const link = `link(href="${path}/${file}" rel="${rel}")`;

    return pug.render(link);
  }

  loadJs(file, path = '/admin/js', type = 'text/javascript') {
    const link = `script(src="${path}/${file}" type="${type}")`;

    return pug.render(link);
  }

  loadPlugin(pluginName) {
    const plugin = this.plugins[pluginName];

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
  }

  bodyClass(className = []) {
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
  }
}

module.exports = Helpers;