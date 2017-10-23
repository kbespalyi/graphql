const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const schema = require('./schemas/books');
const fetch = require('node-fetch')
const DataLoader = require('dataloader')
const util = require('util');
const parseXML = util.promisify(require('xml2js').parseString);

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

app.listen(process.env.PORT || 4000);
console.log('GraphQL Server is now running on localhost:' + (process.env.PORT || 4000));
