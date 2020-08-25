import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import * as turf from '@turf/turf';
import User from '../DB/models/userModel';
import Geo from '../DB/models/geoModel';
import Likes from '../DB/models/likeModel';

const main = body => {
  console.log('body ---- ', body);
  return new Promise((resolve, reject) => {
    (async () => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        jwt.verify(body.token, process.env.TOKEN, async (err, decoded) => {
          //   console.log(decoded);
          const user = await User.findById(decoded.id).exec();
          console.log(user);
          const point = turf.point([
            body.UserLocation.location.lng,
            body.UserLocation.location.lat,
          ]);
          user.geo = point.geometry;
          user.address = body.UserLocation.address;
          console.log('user ---- ', user);
          // save user

          // get new geos

          //   findBoundries(user.geo, async (boundriesError, bounds) => {
          //     log('findBoundries', user.geo, boundriesError, bounds);
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

          console.log('boundries --- ', boundries);
          // populate likes and dislike
          const lv1Boundry = boundries.filter(b => {
            return !b.NAME_1 && !b.NAME_2;
          });
          console.log(lv1Boundry);
          // const likes = await Likes.find({ user_id: decoded.id }).exec;
        });
        //  const user = await User.findOne({_id === body.User.})
      } catch (error) {
        console.log(error);
      }
    })();
  });
};

export default main;
