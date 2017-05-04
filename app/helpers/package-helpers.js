const fs = require('fs');
const p = require('path');
const json = require('jsonfile');
const path = p.resolve(__dirname, '../package.json');
const package = json.readFileSync(path);

module.exports = {
  addValue: function (propertyName, value) {
    package[propertyName] = value;

    this.writePackage(path, package);

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
  getPackage: function () {
    return package;
  }
};