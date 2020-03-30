/* eslint-disable no-new */
/* eslint-disable no-shadow */

import debug from 'debug';

const log = debug('log:v1__serverTiles');

const MBTiles = require('@mapbox/mbtiles');

const header = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Content-Type': 'application/x-protobuf',
  // "Content-Encoding": "gzip"
};

const headerErr = { 'Content-Type': 'text/plain' };

export default function serverTiles(z, x, y, cb) {
  // log(z, x, y);
  if (z < 4) {
    new MBTiles('./mbTiles/0.mbtiles', (err, mbtiles) => {
      mbtiles.getTile(z, x, y, (err, tile) => {
        if (err) {
          log(err);
          return cb(404, headerErr, `Tile rendering error: ${err}\n`);
        }
        return cb(200, header, tile);
      });
    });
  } else if (z < 7) {
    new MBTiles('./mbTiles/1.mbtiles', (err, mbtiles) => {
      mbtiles.getTile(z, x, y, (err, tile) => {
        if (err) {
          log(err);
          return cb(404, headerErr, `Tile rendering error: ${err}\n`);
        }
        return cb(200, header, tile);
      });
    });
  } else {
    new MBTiles('./mbTiles/2.mbtiles', (err, mbtiles) => {
      mbtiles.getTile(z, x, y, (err, tile) => {
        if (err) {
          log(err);
          return cb(404, headerErr, `Tile rendering error: ${err}\n`);
        }
        return cb(200, header, tile);
      });
    });
  }
}
