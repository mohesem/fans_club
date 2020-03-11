import jwt from 'jsonwebtoken';
// import jwtSecret from '../config/jwtConfig';

export default function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
}
