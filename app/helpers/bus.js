'use strict';

const postal = require('postal');
const postalWhen = require('postal.when')(postal);
const Flash = require('@helpers/flash');
const type = require('type-detect');

const bus = {
  channel: 'seller',

  register: function (tag, cb) {
    if (!tag || type(tag).toLocaleLowerCase() !== 'string') throw new Flash({
      message: Flash.FLASH_MESSAGES.HELPERS_BUS_TAG_NOT_FOUND
    });

    if (type(cbSuccess).toLocaleLowerCase() !== 'function') throw new Flash({
      message: Flash.FLASH_MESSAGES.HELPERS_BUS_CALLBACK_NOT_FUNCTION
    });

    postal.subscribe({
      channel: this.channel,
      topic: tag,
      callback: cb
    });
  },

  publish: function (tag, data = null) {
    if (!tag || type(tag).toLocaleLowerCase() !== 'string') throw new Flash({
      message: Flash.FLASH_MESSAGES.HELPERS_BUS_TAG_NOT_FOUND
    });

    postal.publish({
      channel: this.channel,
      topic: tag,
      data
    });
  },

  when: function (tag, cbSuccess) {
    if (!tag || type(tag).toLocaleLowerCase() !== 'string') throw new Flash({
      message: Flash.FLASH_MESSAGES.HELPERS_BUS_TAG_NOT_FOUND
    });

    if (type(cbSuccess).toLocaleLowerCase() !== 'function') throw new Flash({
      message: Flash.FLASH_MESSAGES.HELPERS_BUS_CALLBACK_NOT_FUNCTION
    });

    postal.when([{
      channel: this.channel,
      topic: tag
    }], cbSuccess, {
        once: true
      });
  }
};

module.exports = bus;