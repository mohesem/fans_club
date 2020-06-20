import { Router } from 'express';

import verify from './verify';
import verifyByToken from './verifyByToken';

// import Admin from '../../DB/models/admin';

const router = Router();
router.get('/verify/:username/:password', (req, res) => {
  verify(req.params.username, req.params.password, (status, header, trace) => {
    res
      .set(header)
      .status(status)
      .send({ trace });
  });
});

router.get('/verifyByToken/:token', (req, res) => {
  console.log('got the req', req.params.token);

  verifyByToken(req.params.token, (status, header, trace) => {
    res
      .set(header)
      .status(status)
      .send({ trace });
  });
});
export default router;
