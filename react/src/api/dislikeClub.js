import debug from 'debug';

import axios from 'axios';

const log = debug('log:isUserNew');

export default function likeClub(club) {
  return new Promise((resolve, reject) => {
    axios
      .post('http://185.8.175.15/api/v1/POST/dislikeClub', {
        token: localStorage.fans_club,
        club,
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
