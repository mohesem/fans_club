import debug from 'debug';
import jwt from 'jsonwebtoken';
// import jwtSecret from '../config/jwtConfig';
const log = debug('log:singToken');
export default function decode(obj) {
  log('########################', obj, process.env.TOKEN);

  return new Promise((resolve, reject) => {
    jwt.sign(obj, process.env.TOKEN, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}
