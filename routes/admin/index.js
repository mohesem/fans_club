import { Router } from 'express';

import isAdmin from './isAdmin';
// import Admin from '../../DB/models/admin';

const router = Router();

// router.get('/users/:token', (req, res) => {
//   res.status(200).send({ msg: 'got the req bro' });
// });

router.get('/verify/:username/:password', (req, res) => {
  console.log('gooooooooooooooooooooooooooooooooooot it ');
  isAdmin((req.params.username, req.params.password), (status, trace) => {
    const header = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      'Content-Type': 'application/x-protobuf',
      // "Content-Encoding": "gzip"
    };
    res
      .set(header)
      .status(status)
      .send(trace);
  });
});

export default router;
