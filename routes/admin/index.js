import { Router } from 'express';

import isAdmin from './isAdmin';
// import Admin from '../../DB/models/admin';

const router = Router();

// router.get('/users/:token', (req, res) => {
//   res.status(200).send({ msg: 'got the req bro' });
// });

router.get('/verify/:username/:password', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000/'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
  isAdmin((req.params.username, req.params.password), (status, trace) => {
    res.status(status).send(trace);
  });
});

export default router;
