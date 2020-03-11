import Geo from '../../DB/models/geoModel';

export default function findBounderies(userLoc, cb) {
  Geo.find(
    {
      geo: {
        $geoIntersects: {
          $geometry: {
            type: userLoc.type,
            coordinates: userLoc.coordinates,
          },
        },
      },
    },
    async (err, data) => {
      if (err) return cb(err, { msg: 'Server Internal Error' });
      return cb(null, { array: data });
    }
  );
}
