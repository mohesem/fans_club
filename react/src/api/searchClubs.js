import debug from 'debug';
import axios from 'axios';

const log = debug('log:searchClubsApi');

export default function searchClubs(str) {
  return new Promise((resolve, reject) => {
    axios
      .post('https://www.fansclub.app/api/v1/POST/searchClubs', { str })
      .then(res => {
        // log('res', res);
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
