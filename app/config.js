'use strict';

const envs = [
  'NODE_ENV',
  'SELLER_PORT',
  'SELLER_DB_URL',
  'SELLER_SECRET_KEY',
  'SELLER_SECRET_NAME'
];

envs.forEach(function(env) {
  if (!process.env[env]) throw new Error(`The environment variable ${env} is required!`);
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.SELLER_PORT || 3000,
  db: {
    url: process.env.SELLER_DB_URL
  },
  secret: {
    key: process.env.SELLER_SECRET_KEY,
    name: process.env.SELLER_SECRET_NAME
  }
};