import axios from 'axios';

const mapboxglAccessToken =
  'pk.eyJ1IjoibW9oZXNlbSIsImEiOiJjanR3amhqcWcxZm05NDVtcG03Nm44Ynk4In0.YUdlvT5fABnW8BReNMSuPg';

export default coords => {
  return new Promise((resolve, reject) => {
    const mainAddress = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    const addressResumption = '.json?access_token=';
    const mapboxReqAddress = `${mainAddress + coords.lng},${
      coords.lat
    }${addressResumption}${mapboxglAccessToken}`;

    axios
      .get(mapboxReqAddress)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
