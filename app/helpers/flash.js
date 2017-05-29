'use strict';

const clone = require('clone');
const type = require('type-detect');

const FLASH_MESSAGES = {
  INVALID_USERNAME_PASSWORD: 'Invalid username or password. Please try again.',
  NOT_AUTHORIZED: `You don't have access to this page.`,
  MAX_LOGIN_ATTEMPT: 'You tried to login 5 times. Please try again in 2 hours.',
  GENERAL: 'An error occurred... Could you please try again?',
  LOGOUT: 'You have successfully logged out.',
  SALE_PRICE_BIGGER_PRICE: 'Sale price cannot be smaller than price.',
  PASSWORDS_DOESNT_MATCH: `The passwords are wrong. Did you type correctly?`,
  // Bus
  HELPERS_BUS_TAG_NOT_FOUND: `The parameter "tag" is required and must be a string.`,
  HELPERS_BUS_CALLBACK_NOT_FUNCTION: `The parameter "callback" must be a function.`
};

const FLASH_TYPES = {
  ALERT_ERROR: 'alert-error',
  ALERT_DANGER: 'alert-danger',
  ALERT_INFO: 'alert-info',
  ALERT_WARNING: 'alert-warning',
  ALERT_SUCCESS: 'alert-success',
  ALERT_INPUT: 'help-block'
};

const Flash = function (error = null) {
  this.errors = [];
  this.defaults = {
    target: '.content-flash',
    type: Flash.FLASH_TYPES.ALERT_ERROR
  };

  if (error) {
    this.create(error);
  }
};

Flash.prototype.create = function (error = null) {
  if (!error) return;

  if (this.detect('mongoose', error)) {
    for (let key in error.errors) {
      this.errors.push({
        message: error.errors[key].message,
        target: '.content-flash',
        type: Flash.FLASH_TYPES.ALERT_ERROR
      })
    };

    return;
  }

  if (this.detect('boss', error)) {
    return error.forEach(err => {
      this.errors.push({
        message: err.message,
        name: err.name,
        type: Flash.FLASH_TYPES.ALERT_INPUT
      });
    });
  }

  if (this.detect('Flash', error)) {
    return this.errors = error.errors;
  }

  if (this.detect('Error', error)) {
    return this.errors.push({
      message: error.message,
      type: this.defaults.type,
      target: this.defaults.target
    });
  }

  if (this.detect('object', error)) {
    return this.errors.push({
      message: error.message,
      name: error.name || null,
      type: error.type || this.defaults.type,
      target: error.target || this.defaults.target
    });
  }

  throw new Error('Flash: Failed to create a new error!');
};

Flash.prototype.detect = function (lib, error) {
  switch (lib) {
    case 'mongoose':
      return type(error.errors).toLocaleLowerCase() === 'object' && error.name === 'ValidationError';
    case 'boss':
      return Array.isArray(error);
    case 'Flash':
      return error instanceof Flash;
    case 'object':
      return type(error).toLowerCase() === 'object' && type(error.message).toLowerCase() === 'string';
    case 'Error':
      return error instanceof Error;
  }

  return false;
};

Flash.prototype.list = function () {
  const errors = clone(this.errors);

  this.reset();

  return errors;
};

Flash.prototype.reset = function () {
  this.errors = [];
};

Flash.FLASH_TYPES = FLASH_TYPES;
Flash.FLASH_MESSAGES = FLASH_MESSAGES;

module.exports = Flash;