import { Router } from 'express';

import isAdmin from './isAdmin';
// import Admin from '../../DB/models/admin';

const router = Router();

// router.get('/users/:token', (req, res) => {
//   res.status(200).send({ msg: 'got the req bro' });
// });

router.get('/verify/:username/:password', (req, res, next) => {
  isAdmin((req.params.username, req.params.password), (status, trace) => {
    res.status(status).send(trace);
  });
});

export default router;
