/* eslint-disable no-underscore-dangle */
import debug from 'debug';
import * as turf from '@turf/turf';
import Like from '../DB/models/likeModel';

const log = debug('log:v1');

// TODO: add spec later
// TODO: add dislikes later
// NOTE: as it is for showcase it only returns likes
// [bounds._sw.lng, bounds._sw.lat, bounds._ne.lng, bounds._ne.lat]
export default function getMembersFromPoly(swlng, swlat, nelng, nelat, val, teamId, cb) {
  const boundsCoords = [swlng, swlat, nelng, nelat];
  const requestedPoly = turf.bboxPolygon(boundsCoords);

  Like.find(
    {
      team_id: '5e6aa5e6075d200d2a9d7530',
      geo: {
        $geoWithin: {
          $geometry: requestedPoly.geometry,
        },
      },
    },
    (err, res) => {
      console.log(res);
      if (err) return cb(500, { msg: 'Inernal Server Error' });
      return cb(200, { likes: res });
    }
  );
}
