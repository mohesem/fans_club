import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../DB/models/userModel';

const main = body => {
  return new Promise((resolve, reject) => {
    (async () => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        jwt.verify(body.token, process.env.TOKEN, (err, decoded) => {
          console.log(decoded);
        });
        //  const user = await User.findOne({_id === body.User.})
      } catch (error) {
        console.log(error);
      }
    })();
  });
};

export default main;
