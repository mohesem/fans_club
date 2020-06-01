import debug from 'debug';
import User from '../../DB/models/userModel';

const log = debug('log:db');

export default function getUserByEmail(facebookId, cb) {
  console.log('gert user by facebookId is working', facebookId);

  User.findOne({ facebookId }, (err, user) => {
    console.log('getUserByFacebookID result', err, user);
    if (err) return cb(err, null);
    return cb(null, user);
  });
}
