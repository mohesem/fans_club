import debug from 'debug';
import User from '../../DB/models/userModel';

const log = debug('log:db');

export default function getUserByEmail(email, cb) {
  log('gert user by email is working', email);

  User.findOne({ email }, (err, user) => {
    log('getUserByEmail result', err, user);
    if (err) return cb(err, null);
    return cb(null, user);
  });
}
