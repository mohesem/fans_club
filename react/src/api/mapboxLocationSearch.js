import axios from 'axios';

export default (str, center) => {
  return new Promise((resolve, reject) => {
    const MainUri = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    const Token =
      '&access_token=pk.eyJ1IjoibW9oZXNlbSIsImEiOiJjanR3amhqcWcxZm05NDVtcG03Nm44Ynk4In0.YUdlvT5fABnW8BReNMSuPg';
    const Uri = `${MainUri}${str}.json?proximity=${center.lng},${center.lat}${Token}`;

    axios
      .get(Uri)
      .then(async res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
