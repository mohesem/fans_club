import axios from 'axios';

export default function likeClub(club, token) {
  return new Promise((resolve, reject) => {
    axios
      .post('https://www.fansclub.app/api/v1/POST/likeClub', {
        token,
        club,
      })
      .then(res => {
        resolve({
          data: res.data,
          status: res.status,
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
