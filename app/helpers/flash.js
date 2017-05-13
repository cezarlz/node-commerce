'use strict';

const clone = require('clone');

const FLASH_MESSAGES = {
  INVALID_USERNAME_PASSWORD: 'Invalid username or password. Please try again.',
  NOT_AUTHORIZED: `You don't have access to this page.`,
  MAX_LOGIN_ATTEMPT: 'You tried to login 5 times. Please try again in 2 hours.',
  GENERAL: 'An error occurred... Could you please try again?',
  LOGOUT: 'You have successfully logged out.',
  SALE_PRICE_BIGGER_PRICE: 'Sale price cannot be smaller than price.',
  PASSWORDS_DOESNT_MATCH: `The passwords are wrong. Did you type correctly?`
};

const FLASH_TYPES = {
  ALERT_ERROR: 'alert-error',
  ALERT_DANGER: 'alert-danger',
  ALERT_INFO: 'alert-info',
  ALERT_WARNING: 'alert-warning',
  ALERT_INPUT: 'help-block'
};

const defaultError = { message: null, type: FLASH_TYPES.ALERT_ERROR, target: '.content-flash' };

const Flash = function (error = defaultError) {
  this.errors = [];

  if (error.message) {
    this.create(Object.assign({}, defaultError, error));
  }
};

Flash.prototype.set = function (errors = []) {
  this.errors = errors;
}

Flash.prototype.create = function (error) {
  this.errors.push(error);
};

Flash.prototype.list = function () {
  const errors = clone(this.errors);

  this.reset();

  return errors;
};

Flash.prototype.reset = function () {
  this.errors = [];
};

Flash.FLASH_MESSAGES = FLASH_MESSAGES;

Flash.FLASH_TYPES = FLASH_TYPES;


module.exports = Flash;