import debug from 'debug';

import axios from 'axios';

const log = debug('log:isUserNew');

export default function deleteClub(club, type) {
  return new Promise((resolve, reject) => {
    axios
      .post('https://www.fansclub.app/api/v1/POST/deleteClub', {
        token: localStorage.fans_club,
        club,
        type,
      })
      .then(res => {
        log('res', res);
        resolve({
          data: res.data,
          status: res.status,
        });
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
