import debug from 'debug';

import spec from './spec';
import makeNewUser from '../db/makeNewUser';

const log = debug('log:v1');

export default async function(body, cb) {
  console.log('make ne user is :::', body);
  const test = await spec(body);
  log('test isNewUser', test);

  if (Object.entries(test).length) return cb(400, { test });
  makeNewUser(body, (status, trace) => {
    return cb(status, trace);
  });
  return null;
}
