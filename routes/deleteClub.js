/* eslint-disable eqeqeq */
/* eslint-disable no-underscore-dangle */
import debug from 'debug';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import validator from './validator';
import Dislike from '../DB/models/dislikeModel';
import Like from '../DB/models/likeModel';
import getUserById from './db/getUserInfoById';
import findBoundries from './db/findBoundries';

const log = debug('log:v1');

export default async function(body, cb) {
  const { token, club, type } = body;

  jwt.verify(token, process.env.TOKEN, (err, decoded) => {
    if (err) return cb(500, { other: 'Server Internal Error' });
    getUserById(decoded.id, async (error, user) => {
      if (error) return cb(500, { other: 'Server Internal Error' });
      if (!user) return cb(400, 'User doesnt exist');

      // console.log(user[`${type}s`]);

      // const newLikeOrDislike = user[`${type}s`].filter(a => a._id !== club._id);

      // user[`${type}s`] = newLikeOrDislike;

      // console.log(user[`${type}s`]);

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await user.save();

        if (type === 'like') {
          const n = await user.likes.filter(like => like._id != club._id);
          user.likes = n;
          await user.save();
          await Like.deleteMany({ user_id: user._id, team_id: club._id });

          getUserById(user._id, (finalError, finalUser) => {
            if (finalError) return cb(500, { msg: 'internal error' });

            return cb(200, {
              firstname: finalUser.firstname,
              lastname: finalUser.lastname,
              likes: finalUser.likes || null,
              dislikes: finalUser.dislikes || null,
              suggests: finalUser.suggests || null,
              location: finalUser.geo,
            });
          });
        }

        if (type === 'dislike') {
          const n = await user.dislikes.filter(dislike => dislike._id != club._id);
          user.dislikes = n;
          await user.save();
          await Dislike.deleteMany({ user_id: user._id, team_id: club._id });

          getUserById(user._id, (finalError, finalUser) => {
            if (finalError) return cb(500, { msg: 'internal error' });

            return cb(200, {
              firstname: finalUser.firstname,
              lastname: finalUser.lastname,
              likes: finalUser.likes || null,
              dislikes: finalUser.dislikes || null,
              suggests: finalUser.suggests || null,
              location: finalUser.geo,
            });
          });
        }

        await session.commitTransaction();
        await session.endSession();
      } catch (e) {
        await session.abortTransaction();
        session.endSession();
        // throw err;
        return cb(500, { msg: 'internal error' });
      }
    });
  });

  return null;
}
