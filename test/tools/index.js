'use strict';

module.exports = () => {
  process.setMaxListeners(0);
  require('events').EventEmitter.prototype.setMaxListeners(100);

  const crypto     = require('crypto');
  const path       = require('path');
  const P          = require('bluebird');
  P.onPossiblyUnhandledRejection(() => {});
  const server     = require(path.resolve(__dirname, '../../src/server/server.js'));

  const output = {
    app: server,
    p: () => P.resolve()
  };

  output.startServer = () => new P(
    (resolve) => {
      output.app.start((_server) => {
        resolve(_server);
      });
    }
  );

  output.standardSetup = () => {
    // If no config have to read firstly
    if (!output.config) {
      const config = require('../../src/server/configs/datasources.test.js');
      if (config.db.host !== '0.0.0.0' || config.db.port !== 27017) {
        throw new Error('Invalid DB');
      } else if (process.env.NODE_ENV !== 'test') {
        throw new Error('Invalid NODE_ENV');
      }

      output.config = config;
    }

    return output
      .p()
      .then(() => output.startServer())
      .then((_server) => {
        return _server;
      })
      .catch(err => {
        throw new Error(err);
      });
  };

  output.standardTearDown = (_server) => output
    .p()
    .then(() => {
      _server.close();
      _server = null;
    })
    .catch(err => {
      throw new Error(err);
    });

  output.setupDb = () => output
    .p()
    .then(() => [
      output.app.models.user
    ])
    .map((model) => output.destroyAll(model), {concurrency: 4});

  output.destroyAll = (model) => new P(
    (resolve, reject) => {
      model.destroyAll((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  );

  return output;
};
