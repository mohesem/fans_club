import axios from 'axios';

export default function isUserNew(email) {
  return new Promise((resolve, reject) => {
    axios
      .post('https://www.fansclub.app/api/v1/POST/isUserNew', {email})
      .then(res => {
        console.log('res', res);
        resolve({
          data: res.data,
          status: res.status,
        });
      })
      .catch(err => {
        console.log('err !!!', err);

        if (typeof err.response !== 'object') {
          reject({
            status: 503,
          });
        } else {
          reject(err.response.data);
        }
      });
  });
}
