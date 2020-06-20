import { Router } from 'express';

import isAdmin from '../middlewares/isAdmin';

import count from './count';
import details from './details';

const router = Router();
router.get('/count/:token', isAdmin, (req, res) => {
  console.log('got the req');

  count((status, header, trace) => {
    res
      .set(header)
      .status(status)
      .send({ trace });
  });
});

router.get('/details/:teamId/:token', isAdmin, (req, res) => {
  console.log('got the req');

  details(req.params.teamID, (status, header, trace) => {
    res
      .set(header)
      .status(status)
      .send({ ...trace });
  });
});

export default router;
