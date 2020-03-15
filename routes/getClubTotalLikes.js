import debug from 'debug';
import Like from '../DB/models/likeModel';
import Team from '../DB/models/teamsModel';

const log = debug('log:v1');

function findPointsForLikes(within, teamId, gender) {
  // log(')))))))))))))))))))))))))))))', within);
  return new Promise((resolve, reject) => {
    Like.countDocuments({
      // geo: {
      //   $geoWithin: {
      //     $geometry: reqPoly.geometry,
      //   },
      // },
      team_id: teamId,
      gender,
      date: {
        $gte: new Date(within[0]),
        $lte: new Date(within[1]),
      },
      // fid: {
      //   $lte: '500',
      // },
    }).exec((err, res) => {
      if (err) {
        log('geoWithin err', err);
        reject(err);
      }
      // log('geoWithin', res);
      resolve(res);
    });
  });
}

export default function getTotalLikes(body, cb) {
  log('get total likes', body);
  const teamId = '5e6aa5e6075d200d2a9d7530';

  const startDate = 1580114579000;
  const endDate = 1590568979000;
  const def = (endDate - startDate) / 6;

  // const step1 = [startDate, startDate + def];
  // const step2 = [startDate, step1[1] + def];
  // const step3 = [startDate, step2[1] + def];
  // const step4 = [startDate, step3[1] + def];
  // const step5 = [startDate, step4[1] + def];
  // const step6 = [startDate, endDate];

  const step1 = [startDate, startDate + def];
  const step2 = [step1[1], step1[1] + def];
  const step3 = [step2[1], step2[1] + def];
  const step4 = [step3[1], step3[1] + def];
  const step5 = [step4[1], step4[1] + def];
  const step6 = [step5[1], step5[1] + def];

  try {
    (async () => {
      // const likes = await Like.countDocuments(
      //   { team_id: '5e1c496829f2674320b0bc2e' },
      //   (err, res) => {
      //     if (err) return cb(500, { msg: 'Internal Serever Error' });
      //     return res;
      //   }
      // );

      const males = await (async () => {
        const males1 = await findPointsForLikes(step1, teamId, 'male');
        const males2 = (await findPointsForLikes(step2, teamId, 'male')) + males1;
        const males3 = (await findPointsForLikes(step3, teamId, 'male')) + males2;
        const males4 = (await findPointsForLikes(step4, teamId, 'male')) + males3;
        const males5 = (await findPointsForLikes(step5, teamId, 'male')) + males4;
        const males6 = (await findPointsForLikes(step6, teamId, 'male')) + males5;

        return [males1, males2, males3, males4, males5, males6];
      })();

      const females = await (async () => {
        const females1 = await findPointsForLikes(step1, teamId, 'female');
        const females2 = (await findPointsForLikes(step2, teamId, 'female')) + females1;
        const females3 = (await findPointsForLikes(step3, teamId, 'female')) + females2;
        const females4 = (await findPointsForLikes(step4, teamId, 'female')) + females3;
        const females5 = (await findPointsForLikes(step5, teamId, 'female')) + females4;
        const females6 = (await findPointsForLikes(step6, teamId, 'female')) + females5;

        return [females1, females2, females3, females4, females5, females6];
      })();

      const team = await Team.findById('5e6aa5e6075d200d2a9d7530', (error, res) => {
        // log(error, res);
        if (error) return cb(500, { msg: 'Internal Serever Error' });
        return res;
      });

      // log(males, females, team);

      return cb(200, { males, females, team });
    })();
  } catch (error) {
    log(error);
    return cb(500, { msg: 'Internal Serever Error' });
  }

  // Like.countDocuments({ team_id: '5e1c496829f2674320b0bc2e' }, (err, total) => {
  //   if (err) return cb(500, { msg: 'Internal Serever Error' });

  //   Team.findById('5e1c496829f2674320b0bc2e', (error, team) => {
  //     log(error, team);
  //     if (error) return cb(500, { msg: 'Internal Serever Error' });
  //     return cb(200, { total, team });
  //   });
  //   return undefined;
  // });
}

// function findPointsForLikes(within, reqPoly, teamId, str) {
//   // log(')))))))))))))))))))))))))))))', within);
//   return new Promise((resolve, reject) => {
//     Like.countDocuments({
//       geo: {
//         $geoWithin: {
//           $geometry: reqPoly.geometry,
//         },
//       },
//       team_id: teamId,
//       gender: str,
//       date: {
//         $gte: new Date(within[0]),
//         $lte: new Date(within[1]),
//       },
//       fid: {
//         $lte: 500,
//       },
//     }).exec((err, res) => {
//       if (err) {
//         log('geoWithin err', err);
//         reject(err);
//       }
//       log('geoWithin', res);
//       resolve(res);
//     });
//   });
// }

// async function getPointsFromPoly(body, cb) {
//   const startDate = 1580114579000;
//   const endDate = 1590568979000;
//   const def = (endDate - startDate) / 6;
//   const step1 = [startDate, startDate + def];
//   const step2 = [step1[1], step1[1] + def];
//   const step3 = [step2[1], step2[1] + def];
//   const step4 = [step3[1], step3[1] + def];
//   const step5 = [step4[1], step4[1] + def];
//   const step6 = [step5[1], step5[1] + def];

//   // const step2 = step1 + def

//   log('get points from poly body ==> ', body);
//   const { bounds, val /* teamId */ } = body;
//   const boundsCoords = [bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._ne.lat];
//   const requestedPoly = turf.bboxPolygon(boundsCoords);
//   console.log(requestedPoly);

//   console.log(requestedPoly.geometry.coordinates);

//   const teamId = '5e1c496829f2674320b0bc2e';
//   try {
//     if (val === 'like') {
//       const males1 = await findPointsForLikes(step1, requestedPoly, teamId, 'male');
//       const males2 = await findPointsForLikes(step2, requestedPoly, teamId, 'male');
//       const males3 = await findPointsForLikes(step3, requestedPoly, teamId, 'male');
//       const males4 = await findPointsForLikes(step4, requestedPoly, teamId, 'male');
//       const males5 = await findPointsForLikes(step5, requestedPoly, teamId, 'male');
//       const males6 = await findPointsForLikes(step6, requestedPoly, teamId, 'male');

//       const males = [males1, males2, males3, males4, males5, males6];

//       const females1 = await findPointsForLikes(step1, requestedPoly, teamId, 'female');
//       const females2 = await findPointsForLikes(step2, requestedPoly, teamId, 'female');
//       const females3 = await findPointsForLikes(step3, requestedPoly, teamId, 'female');
//       const females4 = await findPointsForLikes(step4, requestedPoly, teamId, 'female');
//       const females5 = await findPointsForLikes(step5, requestedPoly, teamId, 'female');
//       const females6 = await findPointsForLikes(step6, requestedPoly, teamId, 'female');

//       const females = [females1, females2, females3, females4, females5, females6];

//       return await cb(undefined, 200, { males, females });
//     }
//   } catch (e) {
//     return cb(true, 500, { msg: 'server internal error' });
//   }
// }

// async function getMembers(body, cb) {
//   const { bounds, val /* teamId */ } = body;
//   const boundsCoords = [bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._ne.lat];
//   const requestedPoly = turf.bboxPolygon(boundsCoords);

//   Like.find(
//     {
//       team_id: '5e1c496829f2674320b0bc2e',
//       geo: {
//         $geoWithin: {
//           $geometry: requestedPoly.geometry,
//         },
//       },
//     },
//     (err, res) => {
//       if (err) return cb(err, 500, { msg: 'inernal error' });
//       return cb(undefined, 200, { likes: res });
//     }
//   );
// }
