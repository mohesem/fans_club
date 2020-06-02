/* eslint-disable no-underscore-dangle */
import debug from 'debug';
import jwt from 'jsonwebtoken';
import getUserInfoById from '../db/getUserInfoById';

const log = debug('log:v1');

export default function getUserInfo(token, cb) {
  jwt.verify(token, process.env.TOKEN, (err, decoded) => {
    log('??????', err, decoded);
    if (err) return cb(500, { other: 'Server Internal Error' });
    getUserInfoById(decoded.id, (error, user) => {
      if (error) return cb(500, { other: 'Server Internal Error' });
      if (!user) return cb(400, 'User doesnt exist');
      return cb(200, {
        snackMsg: `hello ${user.firstname}`,
        firstname: user.firstname,
        lastname: user.lastname,
        likes: user.likes || null,
        dislikes: user.dislikes || null,
        suggests: user.suggests || null,
        location: user.geo,
        thumbnail: user.thumbnail,
        // from: user.googleId ? 'google' : 'facebook',
      });
    });
    // if (err) reject(err);
    // resolve(decoded);
  });
}
