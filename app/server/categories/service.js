'use strict';

const Flash = require('@helpers/Flash');

const CategoryModel = require('./model');

const Category = {};

Category.create = async function (data = null) {
  try {
    if (!data) throw {
      message: Flash.FLASH_MESSAGE.CATEGORY_PARAMETER_NOT_FOUND
    };

    const category = await new CategoryModel(data);

    await category.save();

    return category;
  }
  catch (e) {
    return Promise.reject(new Flash(e));
  }
};

module.exports = Category;