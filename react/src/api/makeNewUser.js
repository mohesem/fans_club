import debug from 'debug';

import axios from 'axios';

const log = debug('log:makeNewUser');

export default function makeNewUser(user) {
  log('user is : ', user);
  return new Promise((resolve, reject) => {
    axios
      .post('http://185.8.175.15/api/v1/POST/makeNewUser', user)
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
