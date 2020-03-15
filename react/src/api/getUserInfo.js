import axios from 'axios';
import debug from 'debug';

const log = debug('log:isUserValidAPI');

export default token => {
  return new Promise((resolve, reject) => {
    let tries = 0;
    // NOTE: looping 4 times in case of connection error
    (function loop() {
      axios
        .get(`http://http://185.8.175.15/api/v1/GET/getUserInfo/${token}`)
        .then(res => {
          log('is user valid response', res);
          resolve({
            data: res.data,
            status: res.status.code,
          });
        })
        .catch(error => {
          log('is user valid error', error);
          if (typeof error.response !== 'object') {
            if (tries < 4) {
              tries += 1;
              setTimeout(() => {
                loop();
              }, 100);
            } else
              reject({
                status: 503,
              });
          } else
            reject({
              status: error.response.status,
              data: error.response.data,
            });
        });
    })();
  });
};
