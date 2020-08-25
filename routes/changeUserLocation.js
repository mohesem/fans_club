import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import * as turf from '@turf/turf';
import User from '../DB/models/userModel';
import Geo from '../DB/models/geoModel';
import Likes from '../DB/models/likeModel';
import Dislike from '../DB/models/dislikeModel';
// import e from 'express';
//
const main = body => {
  //   console.log('body ---- ', body);
  return new Promise((resolve, reject) => {
    (async () => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        jwt.verify(body.token, process.env.TOKEN, async (err, decoded) => {
          //   console.log(decoded);
          const user = await User.findById(decoded.id).exec();
          //   console.log(user);
          const point = turf.point([
            body.UserLocation.location.lng,
            body.UserLocation.location.lat,
          ]);
          user.geo = point.geometry;
          user.address = body.UserLocation.address;
          await user.save();
          //   console.log('user ---- ', user);
          // save user

          // get new geos

          const boundries = await Geo.find({
            geo: {
              $geoIntersects: {
                $geometry: {
                  type: point.geometry.type,
                  coordinates: point.geometry.coordinates,
                },
              },
            },
          }).exec();

          //   console.log('boundries --- ', boundries);
          // populate likes and dislike
          const lv1Boundry = await boundries.filter(b => !b.name1 && !b.name2)[0];
          const lv2Boundry = await boundries.filter(b => b.name1 && !b.name2)[0];
          const lv3Boundry = await boundries.filter(b => b.name1 && b.name2)[0];

          const likes = await Likes.find({ user_id: decoded.id }).exec();

          // console.log('==============', likes);
          const lv1Likes = likes.filter(l => !l.name1 && !l.name2);
          const lv2Likes = likes.filter(l => l.name1 && !l.name2);
          const lv3Likes = likes.filter(l => l.name1 && l.name2);
          // console.log('++++++++++++++++', lv1Likes);
          await lv1Likes.forEach(async l => {
            l.fid = lv1Boundry.fid;
            l.name0 = lv1Boundry.name0;
            // console.log('-------------------------', l);
            await l.save();
          });
          await lv2Likes.forEach(async l => {
            l.fid = lv2Boundry.fid;
            l.name0 = lv2Boundry.name0;
            l.name1 = lv2Boundry.name1;
            // console.log('-------------------------', l);
            await l.save();
          });
          await lv3Likes.forEach(async l => {
            l.fid = lv3Boundry.fid;
            l.name0 = lv3Boundry.name0;
            l.name1 = lv3Boundry.name1;
            l.name2 = lv3Boundry.name2;
            // console.log('-------------------------', l);
            await l.save();
          });

          const dislikes = await Dislike.find({ user_id: decoded.id });

          const lv1Dislike = dislikes.filter(l => !l.name1 && !l.name2);
          const lv2Dislike = dislikes.filter(l => l.name1 && !l.name2);
          const lv3Dislike = dislikes.filter(l => l.name1 && l.name2);
          // console.log('++++++++++++++++', lv1Likes);
          await lv1Dislike.forEach(async l => {
            l.fid = lv1Boundry.fid;
            l.name0 = lv1Boundry.name0;
            // console.log('-------------------------', l);
            await l.save();
          });
          await lv2Dislike.forEach(async l => {
            l.fid = lv2Boundry.fid;
            l.name0 = lv2Boundry.name0;
            l.name1 = lv2Boundry.name1;
            // console.log('-------------------------', l);
            await l.save();
          });
          await lv3Dislike.forEach(async l => {
            l.fid = lv3Boundry.fid;
            l.name0 = lv3Boundry.name0;
            l.name1 = lv3Boundry.name1;
            l.name2 = lv3Boundry.name2;
            // console.log('-------------------------', l);
            await l.save();
          });

          const finalUser = await User.findById(decoded.id)
            .populate('likes')
            .populate('dislikes')
            .exec();
          // console.log(finalUser);
          resolve(finalUser);
        });
        //  const user = await User.findOne({_id === body.User.})
      } catch (error) {
        reject(error);
      }
    })();
  });
};

export default main;
