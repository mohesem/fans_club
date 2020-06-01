import debug from 'debug';

import spec from './spec';
import getUserByFacebookId from '../db/getUserByFacebookId';

const log = debug('log:v1');

export default async function(body, cb) {
  const { facebookId } = body;

  const test = await spec(facebookId);
  log('test isNewUser', test);
  if (Object.entries(test).length) return cb(400, test);
  getUserByFacebookId({ facebookId }, (err, user) => {
    if (err) return cb(200, { err: true, other: 'Internal Server Error' });
    if (user) return cb(200, { err: true, other: 'Account exists' });
    return cb(200, { msg: 'New User' });
  });
  return null;
}
