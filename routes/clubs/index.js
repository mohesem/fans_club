import { Router } from 'express';

import isAdmin from '../middlewares/isAdmin';

import count from './count';

const router = Router();
router.get('/count', isAdmin, (req, res) => {
  console.log('got the req');

  count((status, header, trace) => {
    res
      .set(header)
      .status(status)
      .send({ trace });
  });
});

export default router;
