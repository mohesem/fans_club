import debug from 'debug';
import User from '../../DB/models/userModel';
import getUserInfoById from './getUserInfoById';

const log = debug('log:db');

export default function signin(obj, cb) {
  log('gert user by email is working', obj);
  const query = {};
  if (Object.facebookId) {
    query.facebookId = obj.facebookId;
  } else {
    query.googleId = obj.googleId;
  }

  User.findOne(query)
    // .populate('likes')
    // .populate('dislikes')
    // .populate('suggests')

    .exec((execError, result) => {
      if (execError) return cb(execError, null);
      // log(`populate result ${result}`);

      getUserInfoById(result.id, (error, user) => {
        if (error) return cb(500, { other: 'Server Internal Error' });
        if (!user) return cb(400, 'User doesnt exist');
        return cb(null, {
          snackMsg: `hello ${user.firstname}`,
          firstname: user.firstname,
          lastname: user.lastname,
          likes: user.likes || null,
          dislikes: user.dislikes || null,
          suggests: user.suggests || null,
          location: user.geo,
          thumbnail: user.thumbnail,
          address: user.address,
          // eslint-disable-next-line no-underscore-dangle
          _id: user._id,
          email: user.email,
          // from: user.googleId ? 'google' : 'facebook',
        });
      });

      // return cb(null, result);
      // resolve({
      //   likes: result ? result.likes : null,
      //   dislikes: result ? result.dislikes : null,
      //   suggests: result ? result.suggests : null,
      // });
    });
}
