import debug from 'debug';
import User from '../../DB/models/userModel';

const log = debug('log:db');

export default function signin(obj, cb) {
  log('gert user by email is working', obj);
  User.findOne({ email: obj.email, facebookId: obj.facebookId, googleId: obj.googleId })
    // .populate('likes')
    // .populate('dislikes')
    // .populate('suggests')

    .exec((execError, result) => {
      if (execError) return cb(execError, null);
      // log(`populate result ${result}`);
      return cb(null, result);
      // resolve({
      //   likes: result ? result.likes : null,
      //   dislikes: result ? result.dislikes : null,
      //   suggests: result ? result.suggests : null,
      // });
    });
}
