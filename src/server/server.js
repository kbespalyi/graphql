const path = require('path');
const P = require('bluebird');
P.onPossiblyUnhandledRejection(() => {});
P.config({
  // Enable cancellation.
  cancellation: true,
  // Enable long stack traces. WARNING this adds very high overhead!
  longStackTraces: false,
  monitoring: true,
  // Enable warnings.
  warnings: false
});

const fs = require('fs');
if (fs.existsSync('./.env')) {
  require('dotenv').config();
}

const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const fetch = require('node-fetch')
const DataLoader = require('dataloader')
const util = require('util');
const parseXML = util.promisify(require('xml2js').parseString);

let NODE_ENV = process.env.NODE_ENV;

if (!NODE_ENV) {
  NODE_ENV = 'local';
  process.env.NODE_ENV = NODE_ENV;
}

app.set('NODE_ENV', NODE_ENV);

let appConfig = {};

try {
  appConfig = require(`./configs/datasources.${NODE_ENV}.js`);
  if (appConfig && (NODE_ENV === 'local' || NODE_ENV === 'test')) {
    if (appConfig.db.host !== '0.0.0.0' || !appConfig.db.port) {
      throw new Error('Invalid DB');
    }
  }
} catch(err) {
  throw new Error(`Invalid NODE_ENV or datasources.${NODE_ENV}.js not found`);
}

app.set('appConfig', appConfig);

const translate = require('./services/translateService');
translate.applyApiKey(appConfig.keys.googleApiKey);

const schema = require('./schemas/books');

const goodreadsApiKey = appConfig.keys.goodreadsApiKey;

const fetchAuthor = id =>fetch(`https://www.goodreads.com/author/show.xml?id=${id}&key=${goodreadsApiKey}`)
  .then(response => response.text())
  .then(xml => {
    if (xml.startsWith('Invalid API key')) {
      throw new Error('Invalid API key');
    } else {
      return xml;
    }
  })
  .then(parseXML)

const fetchBook = id => fetch(`https://www.goodreads.com/book/show/${id}.xml?key=${goodreadsApiKey}`)
  .then(response => response.text())
  .then(xml => {
    if (xml.startsWith('Invalid API key')) {
      throw new Error('Invalid API key');
    } else {
      return xml;
    }
  })
  .then(parseXML)

const fetchBookByISBN = isbn => fetch(`https://www.goodreads.com/book/isbn/${isbn}?key=${goodreadsApiKey}`)
  .then(response => response.text())
  .then(xml => {
    if (xml.startsWith('Invalid API key')) {
      throw new Error('Invalid API key');
    } else {
      return xml;
    }
  })
  .then(parseXML)

app.use('/',
  graphqlHTTP(req => {

    const authorLoader = new DataLoader(keys => Promise.all(keys.map(fetchAuthor)));
    const bookLoader = new DataLoader(keys => Promise.all(keys.map(fetchBook)));
    const bookByISBNLoader = new DataLoader(keys => Promise.all(keys.map(fetchBookByISBN)));

    return {
      schema,
      context: {
        authorLoader,
        bookLoader,
        bookByISBNLoader
      },
      graphiql: true,
      pretty: true
    };
  })
);

app.startRestApp = function(cb) {
  // start the web server
  return app.listen(process.env.PORT || 4000, function() {
    if (process.env.NODE_ENV !== 'test') {
      console.log('GraphQL Server is now running on localhost:' + (process.env.PORT || 4000));
    }
    if (cb) {
      return cb(this);
    }
  });
}

app.start = (cb) => {
  app.startRestApp(cb);
};

if (NODE_ENV !== 'test') {
  app.start();
}

module.exports = app;
