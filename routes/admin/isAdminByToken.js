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
    if (err) return cb(200, headerErr, { err: true, other: 'internal server error' });
    return cb(200, header, { err: false, isAdmin: true });
  });
  return null;
}
