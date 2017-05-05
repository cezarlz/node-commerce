'use strict';

const fs = require('fs');
const p = require('path');
const json = require('jsonfile');
const path = p.resolve(__dirname, '../package.json');

module.exports = {
  addValue: function (propertyName, value) {
    const configs = this.getConfigs();
    
    configs[propertyName] = value;

    this.writePackage(path, configs);

    return this;
  },
  editValue: function (propertyName, value) {
    this.addValue(propertyName, value);

    return this;
  },
  writePackage: function (file, content) {
    return json.writeFileSync(file, content, {
      spaces: 2
    });
  },
  getConfigs: function () {
    return json.readFileSync(path);
  }
};