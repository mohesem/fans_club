import debug from 'debug';
import User from '../../DB/models/userModel';

const log = debug('log:db');

export default function getUserById(id, cb) {
  User.findById(id)
    .populate('likes')
    .populate('dislikes')
    // .populate('suggests')

    .exec((execError, result) => {
      if (execError) return cb(execError, null);
      // log(`populate result ${result}`);
      console.log({ result });
      return cb(null, result);
      // resolve({
      //   likes: result ? result.likes : null,
      //   dislikes: result ? result.dislikes : null,
      //   suggests: result ? result.suggests : null,
      // });
    });
}
