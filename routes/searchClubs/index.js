import debug from 'debug';

import spec from './spec';
import clubsTextSearch from '../db/clubsTextSearch';

const log = debug('log:v1');

export default async function(body, cb) {
  const test = await spec(body);
  // log('test searchClubs', test);

  if (Object.entries(test).length) return cb(400, { test });
  clubsTextSearch(body.str, (err, clubs) => {
    if (err) return cb(500, { other: 'Server Internal Error' });
    return cb(200, { clubs });
  });
  return null;
}
