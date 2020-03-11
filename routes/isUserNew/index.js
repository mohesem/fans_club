import debug from 'debug';

import spec from './spec';
import getUserByEmail from '../db/getUserByEmail';

const log = debug('log:v1');

export default async function(body, cb) {
  const { email } = body;

  const test = await spec(email);
  log('test isNewUser', test);
  if (Object.entries(test).length) return cb(400, test);
  getUserByEmail(email, (err, user) => {
    if (err) return cb(500, { other: 'Internal Server Error' });
    if (user) return cb(401, { other: 'Account exists' });
    return cb(200, { msg: 'New User' });
  });
  return null;
}
