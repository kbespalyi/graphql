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

const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const schema = require('./schemas/books');
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

let dbconfig = {};

try {
  dbconfig = require(`./configs/datasources.${NODE_ENV}.js`);
  if (dbconfig && (NODE_ENV === 'local' || NODE_ENV === 'test')) {
    if (dbconfig.db.host !== '0.0.0.0' || dbconfig.db.port !== 27017) {
      throw new Error('Invalid DB');
    }
  }
} catch(err) {
  throw new Error(`Invalid NODE_ENV or datasources.${NODE_ENV}.js not found`);
}

app.set('dbconfig', dbconfig);

const fetchAuthor = id =>
fetch(`https://www.goodreads.com/author/show.xml?id=${id}&key=6GqmaABbsv03cGt1K6KIsg`)
.then(response => response.text())
.then(xml => {
  if (xml.startsWith('Invalid API key')) {
    throw new Error('Invalid API key');
  } else {
    return xml;
  }
})
.then(parseXML)

const fetchBook = id =>
fetch(`https://www.goodreads.com/book/show/${id}.xml?key=6GqmaABbsv03cGt1K6KIsg`)
  .then(response => response.text())
  .then(xml => {
    if (xml.startsWith('Invalid API key')) {
      throw new Error('Invalid API key');
    } else {
      return xml;
    }
  })
  .then(parseXML)

app.use('/graphql',
  graphqlHTTP(req => {

    const authorLoader = new DataLoader(keys => Promise.all(keys.map(fetchAuthor)));
    const bookLoader = new DataLoader(keys => Promise.all(keys.map(fetchBook)));

    return {
      schema,
      context: {
        authorLoader,
        bookLoader
      },
      graphiql: true,
      pretty: true
    };
  })
);

app.startRestApp = function(cb) {
  // start the web server
  return app.listen(process.env.PORT || 4000, function() {
    console.log('GraphQL Server is now running on localhost:' + (process.env.PORT || 4000));
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
