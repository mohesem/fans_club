import debug from 'debug';

import axios from 'axios';

const log = debug('log:signin');

export default function getMembersFromPoly(bounds, val, teamId) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `http://http://185.8.175.15/api/v1/GET/membersFromPoly/${bounds._sw.lng}/${bounds._sw.lat}/${bounds._ne.lng}/${bounds._ne.lat}/${val}/${teamId}`
      )
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        log('err', err);

        if (typeof err.response !== 'object')
          reject({
            status: 503,
          });
        else reject(err.response.data);
      });
  });
}
