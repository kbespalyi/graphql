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

describe('Test environment', () => {
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

  it('should be able to get NODE_ENV and dbconfig correct', (done) => {
    let scope;

    t.p().then((s) => {
      scope = s;
    })
    .then(() => {
      expect(t.app.get('NODE_ENV')).to.equals('test');
      expect(t.app.get('appConfig')).to.deep.equal(t.config);

      const appConfig = t.app.get('appConfig');
      expect(appConfig.keys).to.be.an('object');
      expect(appConfig.keys.goodreadsApiKey).to.be.not.empty;
      expect(appConfig.keys.googleApiKey).to.be.not.empty;

      done();
    })
    .catch((err) => {
      done(err);
    });
  });
});
