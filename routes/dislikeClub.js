/* eslint-disable eqeqeq */
/* eslint-disable no-underscore-dangle */
import debug from 'debug';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import validator from './validator';
import Dislike from '../DB/models/dislikeModel';
import getUserById from './db/getUserInfoById';
import findBoundries from './db/findBoundries';

const log = debug('log:v1');

const spec = body => {
  const rulesObj = [
    { value: body.token, name: 'token', required: true, type: 'string' },
    {
      value: body.club,
      name: 'club',
      required: true,
      type: 'object',
      keys: [
        { value: '_id', type: 'string' },
        { value: 'group', type: 'string' },
        { value: 'name', type: 'string' },
        { value: 'city', type: 'string' },
        { value: 'primary_color', type: 'string' },
        { value: 'secondary_color', type: 'string' },
      ],
    },
  ];
  return validator(rulesObj);
};
// import likeClub from '../db/likeClub';

export default async function(body, cb) {
  const test = await spec(body);
  log('test searchClubs', test);
  if (Object.entries(test).length) return cb(400, { test });

  const { token } = body;
  jwt.verify(token, process.env.TOKEN, (err, decoded) => {
    if (err) return cb(500, { other: 'Server Internal Error' });
    getUserById(decoded.id, async (error, user) => {
      if (error) return cb(500, { other: 'Server Internal Error' });
      if (!user) return cb(400, 'User doesnt exist');
      if (user.dislikes.length >= 5) return cb(403, 'you can dislike more than 5 clubs');

      // NOTE: check to see if like is unique and its not on dislikes
      const existsOnLikes = await user.likes.find(l => l._id == body.club._id);
      if (existsOnLikes) return cb(403, { other: 'you can"t dislikes clubs you already liked' });
      const existsOnDislikes = await user.dislikes.find(d => d._id == body.club._id);
      if (existsOnDislikes) return cb(403, { other: 'you already disliked this club' });

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
            const newLike = new Dislike({
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
          user.dislikes.push(body.club._id);
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

  return null;
}
