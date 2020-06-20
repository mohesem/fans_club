import jwt from 'jsonwebtoken';
import Admin from '../../DB/models/admin';

export default async function(username, password, cb) {
  console.log('=============', username, password);
  if (!username || !password) return cb(200, { err: true, other: 'bad request' });

  const header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/json',
    // "Content-Encoding": "gzip"
  };

  const headerErr = { 'Content-Type': 'text/plain' };

  Admin.findOne({ username, password }, (err, admin) => {
    console.log('************ ', err, admin);
    if (err) return cb(200, { err: true, headerErr, other: 'server internal error' });
    if (!admin) return cb(200, { err: true, headerErr, other: 'no uwer had been found' });
    jwt.sign({ username, password }, process.env.TOKEN, (error, token) => {
      if (error) return cb(200, { err: true, headerErr, other: 'internal server error' });
      console.log(token);
      return cb(200, { err: false, header, token });
    });
  });
  return null;
}
