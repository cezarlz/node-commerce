'use strict';

const multer = require('multer');
const path = require('path');
const moment = require('moment');
const slug = require('slug');
const mkdirp = require('mkdirp');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const now = moment();

    const dir = path.join(__dirname, `../uploads/${now.format('YYYY')}/${now.format('MM')}`);

    mkdirp(dir, () => {
      cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    const filename = path.parse(file.originalname);

    const name = `${slug(filename.name.toLocaleLowerCase())}-${Date.now()}${filename.ext}`;

    cb(null, name);
  }
});

const upload = multer({
  storage
});

module.exports = upload;