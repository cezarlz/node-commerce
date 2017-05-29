'use strict';

const accounting = require('accounting');
const Settings = require('@server/settings/controller');

const Currency = {};

Currency.format = async function (money, symbol = null) {
  if (!symbol) symbol = await Settings.getField('currency');

  return accounting.formatMoney(money, symbol);
};

Currency.formatNumber = function (number) {
  return accounting.formatNumber(number);
};

Currency.unformat = function (string, decimal = ',') {
  return accounting.unformat(string, decimal);
};

Currency.setConfig = async function ({ currency = {}, number = {} }) {
  const settings = await Settings.get();

  const currencyData = {
    symbol: settings.currency_symbol,
    format: settings.currency_format
  };

  const numberData = {
    precision: 0,
    thousand: ',',
    decimal: '.'
  };

  accounting.settings = Object.assign(
    {},
    {
      currency: currencyData,
      number: numberData
    },
    {
      currency,
      number
    }
  );
};

Currency.getConfig = function () {
  return accounting.settings;
};

module.exports = Currency;