import debug from 'debug';
import { Router } from 'express';
// import path, { dirname } from 'path';

// import { stat } from 'fs';
import makeNewUser from './makeNewUser';
import isUserNew from './isUserNew';
import isUserNewFb from './isUserNewFb';
import signin from './signin';
import getUserInfo from './getUserInfo';
import searchClubs from './searchClubs';
import likeClub from './likeClub';
import dislikeClub from './dislikeClub';
import getClubTotalLikes from './getClubTotalLikes';
import getClub from './getClub';
import getTiles from './getTiles';
import getMembersFromPoly from './getMembersFromPoly';
import getLikesForPolys from './getLikesForPolys';
import deleteClub from './deleteClub';
import changeUserLocation from './changeUserLocation';

import admin from './admin';
import clubs from './clubs';
import users from './users';
import likes from './likes';
import dislikes from './dislikes';

const log = debug('log:v1');

const router = Router();

router.post('/POST/makeNewUser', (req, res) => {
  makeNewUser(req.body, (status, trace) => {
    res.status(status).send(trace);
  });
});

router.post('/POST/isUserNew', (req, res) => {
  isUserNew(req.body, (status, trace) => {
    res.status(status).send(trace);
  });
});

router.post('/POST/isUserNewFb', (req, res) => {
  isUserNewFb(req.body, (status, trace) => {
    res.status(status).send(trace);
  });
});

router.post('/POST/signin', (req, res) => {
  signin(req.body, (status, trace) => {
    res.status(status).send(trace);
  });
});

router.get('/GET/getUserInfo/:token', (req, res) => {
  log('getUesrInfo token is ==> ', req.params.token);
  getUserInfo(req.params.token, (status, trace) => {
    res.status(status).send(trace);
  });
});

router.post('/POST/searchClubs', (req, res) => {
  console.log(req.body);
  searchClubs(req.body, (status, trace) => {
    res.status(status).send(trace);
  });
});

router.post('/POST/likeClub', (req, res) => {
  likeClub(req.body, (status, trace) => {
    res.status(status).send(trace);
  });
});

router.post('/POST/dislikeClub', (req, res) => {
  dislikeClub(req.body, (status, trace) => {
    res.status(status).send(trace);
  });
});

router.get('/GET/getClubTotalLikes/:mode/:id', (req, res) => {
  getClubTotalLikes(req.params.id, req.params.mode, (status, trace) => {
    res.status(status).send(trace);
  });
});
router.get('/GET/tiles/:z/:x/:y', (req, res) => {
  const { z, x, y } = req.params;
  // console.log(x, z, y);
  // log(z, x, y);
  getTiles(z, x, y, (status, header, tile) => {
    // res.;
    // console.log('sending tile');
    if (status === 200) {
      res
        .set(header)
        .status(status)
        .send(tile);
    } else {
      res.sendStatus(204);
    }
  });
});

router.get('/GET/membersFromPoly/:swlng/:swlat/:nelng/:nelat/:val/:teamId', (req, res) => {
  const { swlng, swlat, nelng, nelat, val, teamId } = req.params;
  // console.log(swlng, swlat, nelng, nelat, val, teamId);
  getMembersFromPoly(swlng, swlat, nelng, nelat, val, teamId, (status, trace) => {
    res.status(status).send(trace);
  });
  // log('====+++===++==+=++++======', bounds, val, teamId);
});

router.post('/POST/getLikesForPolys', (req, res) => {
  getLikesForPolys(req.body, (status, trace) => {
    // console.log('getLikesForPolys ......', trace);
    res.status(status).send(trace);
  });
});

// TODO: complete this tomorow
// router.get('/GET/LOGO/:name', (req, res) => {
//   log(req.params.name);
//   // log(__dirname);
//   // res.status(200).sendFile(`${__dirname}/logo/${req.params.name}`);
//   res
//     .status(200)
//     .sendFile(
//       `/home/emad/Documents/projects/FANS_CLUB_LAST/fans_club_back_last/routes/LOGO/BahrainManamaAl-Ahli.jpg`
//     );
// });

router.get('/GET/club/:clubId', (req, res) => {
  console.log('_____', req.params);
  getClub(req.params.clubId, (status, trace) => {
    res.status(status).send(trace);
  });
});

router.post('/POST/deleteClub', (req, res) => {
  deleteClub(req.body, (status, trace) => {
    // log(status, trace);
    res.status(status).send(trace);
  });

  // getClub(req.params.clubId, (status, trace) => {
  //   console.log(status, trace);
  // res.status(status).send(trace);
  // });
});

router.post('/POST/changeUserLocation', async (req, res) => {
  // console.log('got the req', req.body);
  try {
    const user = await changeUserLocation(req.body);
    console.log(')()()()(', user);
    res.status(200).send({ user });
  } catch (error) {
    res.status(200).send({ error: 'problem on changing location' });
  }
});

router.use('/admin', admin);
router.use('/clubs', clubs);
router.use('/users', users);
router.use('/likes', likes);
router.use('/dislikes', dislikes);

export default router;
