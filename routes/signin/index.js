/* eslint-disable no-underscore-dangle */
import debug from 'debug';
import jwt from 'jsonwebtoken';
import signin from '../db/signin';

const log = debug('log:v1');

export default async function(body, cb) {
  const { facebookId, googleId } = body;
  const obj = { facebookId, googleId };
  signin(obj, (err, user) => {
    // return cb(status, trace);

    log('result of population ==> ', err, user);

    if (err) {
      return cb(500, { other: 'Server Internal Error' });
    }
    if (!user) {
      return cb(400, { other: 'no user has been found' });
    }

    jwt.sign({ email: user.email, id: user._id }, process.env.TOKEN, (error, token) => {
      if (err) {
        log('error on creating token', error);
        return cb(500, { other: 'Server Internal Error' });
      }
      return cb(200, {
        token,
        snackMsg: `hello ${user.firstname}, you signed in with ${user.email}`,
        firstname: user.firstname,
        lastname: user.lastname,
        likes: user.likes || null,
        dislikes: user.dislikes || null,
        suggests: user.suggests || null,
        location: user.geo,
        from: user.googleId ? 'google' : 'facebook',
        thumbnail: user.thumbnail,
      });
    });
    return null;

    // TODO: create token
    // TODO: sending likes, dislikes , suggesstions

    // jwt.sign({ email: user.email, id: user._id }, process.env.TOKEN, (err, token) => {
    //   if (err) {
    //     log('error on creating token', err);
    //     return cb(500, { other: 'Server Internal Error' });
    //   }
    //   log('++++++++++++++++++++++', token);
    //   return cb(200, { token, snackMsg: `hello ${savedUser.firstname}` });
    // });
    // return cb(200, {});
  });

  // if (Object.entries(test).length) return cb(400, { test });
  // makeNewUser(body, (status, trace) => {
  //   return cb(status, trace);
  // });
  return null;
}
