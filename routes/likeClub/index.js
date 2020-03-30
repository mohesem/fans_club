/* eslint-disable eqeqeq */
/* eslint-disable no-underscore-dangle */
import debug from 'debug';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Like from '../../DB/models/likeModel';
import spec from './spec';
import getUserById from '../db/getUserInfoById';
import findBoundries from '../db/findBoundries';
// import likeClub from '../db/likeClub';

const log = debug('log:v1');

export default async function(body, cb) {
  const test = await spec(body);
  log('test searchClubs', test);
  if (Object.entries(test).length) return cb(400, { test });

  const { token } = body;
  jwt.verify(token, process.env.TOKEN, (err, decoded) => {
    if (err) return cb(500, { other: 'Server Internal Error' });
    getUserById(decoded.id, async (error, user) => {
      log('----------------------', user);
      if (error) return cb(500, { other: 'Server Internal Error' });
      if (!user) return cb(400, 'User doesnt exist');
      if (user.likes.length >= 5) return cb(403, 'you can like more than 5 clubs');

      // NOTE: check to see if like is unique and its not on dislikes
      const existsOnLikes = await user.likes.find(l => l._id == body.club._id);
      if (existsOnLikes) return cb(403, { other: 'you already liked this club' });
      const existsOnDislikes = await user.dislikes.find(d => d._id == body.club._id);
      if (existsOnDislikes) return cb(403, { other: 'you can likes clubs you already disliked' });

      findBoundries(user.geo, async (boundriesError, bounds) => {
        log('findBoundries', user.geo, boundriesError, bounds);

        if (boundriesError) return cb(500, { other: 'Server Internal Error' });
        if (!bounds.array.length) return cb(400, { msg: 'unable to resolve coordinates' });

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          /* NOTE:
           ** add teams_user_boundry for handeling search
           ** without any need to use geo tools and searching
           ** the actual boundary
           */
          await bounds.array.forEach(boundary => {
            console.log('...........................', boundary);
            const newLike = new Like({
              name0: boundary.name0,
              name1: boundary.name1,
              name2: boundary.name2,
              user_id: user._id,
              boundy_id: boundary._id,
              team_id: body.club._id,
              geo: user.geo,
              fid: boundary.fid,
              gender: user.gender,
            });
            newLike.save();
          });

          /* NOTE:
           ** add like to user for faster accesss when
           ** we only need teams of an specific user
           */
          user.likes.push(body.club._id);
          await user.save();

          await session.commitTransaction();
          await session.endSession();

          return null;
        } catch (sessionErr) {
          await session.abortTransaction();
          session.endSession();
          // throw err;
          return cb(500, { msg: 'internal error' });
        } finally {
          getUserById(user._id, (finalError, finalUser) => {
            if (finalError) return cb(500, { msg: 'internal error' });

            return cb(200, {
              snackMsg: `hello ${finalUser.firstname}`,
              firstname: finalUser.firstname,
              lastname: finalUser.lastname,
              likes: finalUser.likes || null,
              dislikes: finalUser.dislikes || null,
              suggests: finalUser.suggests || null,
              location: finalUser.geo,
            });
          });
        }
      });
      return null;
    });
  });

  // clubsTextSearch(body.str, (err, clubs) => {
  //   log(err, clubs);
  //   if (err) return cb(500, { other: 'Server Internal Error' });
  //   return cb(200, { clubs });
  // });
  return null;
}
