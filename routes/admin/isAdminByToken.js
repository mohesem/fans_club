import jwt from 'jsonwebtoken';
import Admin from '../../DB/models/admin';

export default async function(token, cb) {
  if (!token) return cb(200, { err: true, other: 'bad request' });

  const header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/json',
  };

  const headerErr = { 'Content-Type': 'text/plain' };

  jwt.verify(token, process.env.TOKEN, (err, decoded) => {
    console.log(err, decoded);
  });

  // Admin.findOne({ username, password }, (err, admin) => {
  //   console.log('************ ', err, admin);
  //   if (err) return cb(200, headerErr, { err: true, other: 'server internal error' });
  //   if (!admin) return cb(200, headerErr, { err: true, other: 'no uwer had been found' });
  //   jwt.sign({ username, password }, process.env.TOKEN, (error, token) => {
  //     if (error) return cb(200, headerErr, { err: true, other: 'internal server error' });
  //     console.log(token);
  //     return cb(200, header, { err: false, token });
  //   });
  // });
  return null;
}
