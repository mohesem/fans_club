import axios from 'axios';

export default function signin(newLoc) {
  return new Promise((resolve, reject) => {
    axios
      .post('https://www.fansclub.app/api/v1/POST/changeUserLocation', newLoc)
      .then(res => {
        resolve({
          data: res.data,
          status: res.status.code,
        });
      })
      .catch(err => {
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
