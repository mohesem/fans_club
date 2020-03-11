import debug from 'debug';

import axios from 'axios';

const log = debug('log:getUserAddressFromMapbox');

const mapboxglAccessToken =
  'pk.eyJ1IjoibW9oZXNlbSIsImEiOiJjanR3amhqcWcxZm05NDVtcG03Nm44Ynk4In0.YUdlvT5fABnW8BReNMSuPg';

export default function getUserLocationFromMapbox(coords) {
  return new Promise((resolve, reject) => {
    const mainAddress = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    const addressResumption = '.json?access_token=';
    const mapboxReqAddress = `${mainAddress + coords.lng},${
      coords.lat
    }${addressResumption}${mapboxglAccessToken}`;

    axios
      .get(mapboxReqAddress)
      .then(res => {
        log('mapbox api', res);

        resolve(res);
      })
      .catch(err => {
        log('mapbox api', err);
        reject(err);
      });
  });
}
