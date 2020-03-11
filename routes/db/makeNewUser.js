/* eslint-disable no-underscore-dangle */
import debug from 'debug';
import * as turf from '@turf/turf';
import jwt from 'jsonwebtoken';
import User from '../../DB/models/userModel';

const log = debug('log:db:makeNewuser');

export default (body, cb) => {
  log('-------------------------------------------', process.env.TOKEN);

  const {
    from,
    email,
    firstname,
    lastname,
    fullname,
    picture,
    thumbnail,
    googleId,
    facebookId,
    location,
    address,
    birth,
    gender,
  } = body;

  const point = turf.point([location.lng, location.lat]);

  const newUser = new User({
    geo: point.geometry,
    address,
    email,
    fullname,
    firstname,
    lastname,
    thumbnail,
    picture,
    birth: new Date(birth),
    gender,
  });
  /*
      NOTE:
        add google or facebook id to user
      */
  if (from === 'google') {
    newUser.googleId = googleId;
  }
  if (from === 'facebook') {
    newUser.facebookId = facebookId;
  }

  try {
    newUser.save((error, savedUser) => {
      if (error) {
        log('save err', error);
        if (error.code === 11000) {
          return cb(500, { other: 'email should be unique' });
        }
        return cb(500, { other: 'Internal Server Error' });
      }

      jwt.sign({ email: savedUser.email, id: savedUser._id }, process.env.TOKEN, (err, token) => {
        if (err) {
          log('error on creating token', err);
          return cb(500, { other: 'Server Internal Error' });
        }
        log('++++++++++++++++++++++', token);
        return cb(200, { token, snackMsg: `hello ${savedUser.firstname}` });
      });

      return null;
    });
  } catch (e) {
    log('eeeeeeeeeeeeeeeeeeeeee', e);
    return cb(500, { other: 'Internal Server Error' });
  }
};
