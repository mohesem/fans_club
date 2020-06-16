import jwt from 'jsonwebtoken';
import Admin from '../../DB/models/admin';

export default async function(username, password, cb) {
  console.log('=============', username, password);
  if (!username || !password) return cb(200, { err: true, other: 'bad request' });

  Admin.findOne({ username, password }, (err, admin) => {
    console.log('************ ', err, admin);
    if (err) return cb(200, { err: true, other: 'server internal error' });
    if (!admin) return cb(200, { err: true, other: 'no uwer had been found' });
    jwt.sign({ username, password }, process.env.TOKEN, (error, token) => {
      if (error) return cb(200, { err: true, other: 'internal server error' });
      return cb(200, { err: false, token });
    });
  });
  return null;
}
