import jwt from 'jsonwebtoken';
import Admin from '../../DB/models/admin';

const headerErr = { 'Content-Type': 'text/plain' };

export default async (req, res, next) => {
  const { token } = req.params;
  jwt.verify(token, process.env.TOKEN, (err, decoded) => {
    console.log(err, decoded);
    if (err)
      res
        .set(headerErr)
        .status(200)
        .send({ err: true, other: 'internal server error' });

    Admin.findOne({ username: decoded.username }, (error, response) => {
      if (error)
        res
          .set(headerErr)
          .status(200)
          .send({ err: true, other: 'internal server error' });
      if (!response)
        res
          .set(headerErr)
          .status(200)
          .send({ err: true, other: 'no user had been fround' });
      next();
    });
  });
};
