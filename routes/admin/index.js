import { Router } from 'express';
// import Admin from '../../DB/models/admin';

const router = Router();

router.get('/users/:token', (req, res) => {
  res.status(200).send({ msg: 'got the req bro' });
});

export default router;
