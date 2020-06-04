import axios from 'axios';

export default token => {
  return new Promise((resolve, reject) => {
    let tries = 0;
    // NOTE: looping 4 times in case of connection error
    (function loop() {
      axios
        .get(`https://www.fansclub.app/api/v1/GET/getUserInfo/${token}`)
        .then(res => {
          console.log('is user valid response', res);
          resolve({
            data: res.data,
            status: res.status.code,
          });
        })
        .catch(error => {
          console.log('is user valid error', error);
          if (typeof error.response !== 'object') {
            if (tries < 4) {
              tries += 1;
              setTimeout(() => {
                loop();
              }, 100);
            } else {
              reject({
                status: 503,
              });
            }
          } else {
            reject({
              status: error.response.status,
              data: error.response.data,
            });
          }
        });
    })();
  });
};
