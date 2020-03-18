import debug from 'debug';

import axios from 'axios';

const log = debug('log:signin');

export default function signin(user) {
  log('====================== user is : ', user);
  return new Promise((resolve, reject) => {
    axios
      .post('https://www.fansclub.app/api/v1/POST/signin', user)
      .then(res => {
        log('res', res);
        resolve({
          data: res.data,
          status: res.status.code,
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
