import debug from 'debug';
import fs from 'fs';
import Teams from '../DB/models/teamsModel';
import City from '../DB/models/cityModel';

const log = debug('log:v1');

// 5e6aa5e6075d200d2a9d7530
const findImg = (country, city, name) => {
  return new Promise(resolve => {
    fs.promises.readFile(
      `/root/repos/fans_club/routes/logo/${country + city + name}.png`,
      (errRead, img) => {
        if (img) {
          resolve(img);
        } else {
          fs.promises.readFile(
            `/root/repos/fans_club/routes/logo/${country + city + name}.jpg`,
            (errRead, img) => {
              if (img) {
                resolve(img);
              } else {
                resolve();
              }
            }
          );
        }
      }
    );
  });
};

export default function getClub(teamId, cb) {
  Teams.findById(teamId, async (err, club) => {
    if (err) {
      console.log(`error on finding club \n ${err}`);
      return cb(500, 'error on finding club');
    }
    // console.log('club ==> ', club);

    // log('club ==> ', club);
    const { city, group, country, name } = club;
    // city.trim();
    // country.trim();
    // name.trim();

    // log('@@@@@@@@@@@@@@@@@@@@@@@@', country, city);

    if ((country && city, name)) {
      const img = await findImg(country, city, name);
      if (!img) {
        // console.log('---------------------', errRead);
        return cb(200, { club, errRead: 'not found logo' });
      }
      City.findOne(
        {
          country: country.trim(),
          name: city.trim(),
        },
        async (errCity, cityObj) => {
          if (errCity) {
            console.log('--------------- finding City', errCity);
            return cb(200, { club, errCity });
          }
          if (!cityObj) {
            console.log('--------------- no city has been found', cityObj);
            return cb(200, { club, errCity: null });
          }
          const base64Image = Buffer.from(img).toString('base64');

          // Buffer.from(img, 'binary').toString('base64');

          // console.log('-----------------', cityObj);
          return cb(200, {
            city: cityObj,
            club,
            base64Image,
          });

          // TODO: send new json with club, city and buffer
        }
      );
    } else {
      return cb(200, club);
    }
  });
}
