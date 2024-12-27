/* eslint-disable no-undef */

const dotenv = require('dotenv');
const path = require('path');

// Load environment-specific .env file
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `${env}.env`) });

const config = {
  development: process.env,
  staging: process.env,
  production: process.env
};

module.exports = config[env];
