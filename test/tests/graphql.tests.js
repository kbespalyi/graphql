'use strict';

const moment = require('moment');
const path   = require('path');
const chai   = require('chai');
const expect = chai.expect;
const P      = require('bluebird');
P.onPossiblyUnhandledRejection(() => {});

chai.should();
chai.use(require('chai-things'));

const t = require(path.resolve('./test/tools'))();

describe('Test graphql', () => {
  let _server;

  beforeEach((done) => {
    t.standardSetup()
      .then((server) => {
        _server = server;
        done();
      });
  });

  afterEach((done) => {
    t.standardTearDown(_server)
    .then(() => {
      done();
    });
  });

  it('should be able to read goodreads', (done) => {
    let scope;

    t.p().then((s) => {
      scope = s;
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
  });
});
