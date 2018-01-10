'use strict';

const extend = require('util')._extend;
const DB     = process.env.DB || 'mongodb';

const googleApiKey = process.env.GOOGLE_API_KEY;
const goodreadsApiKey = process.env.GOODREADS_API_KEY;

const DATASTORES = {
  memory:  {},
  mongodb: {
    host:     '0.0.0.0',
    database: 'graphql-core-production',
    username: '',
    password: '',
    port:     27017
  },
  googleApiKey
};

if (!(DB in DATASTORES)) {
  console.error('Invalid DB "%s"', DB);
  console.error('Supported values:', Object.keys(DATASTORES).join(', '));
  process.exit(1);
}

const connector = DB === 'memory' ? DB : 'native-connector-' + DB;
const config    = extend({connector: connector}, DATASTORES[DB]);

module.exports = {
  db: config,
  keys: {
    googleApiKey,
    goodreadsApiKey
  }
};
