import debug from 'debug';
import fs from 'fs';
import Teams from '../DB/models/teamsModel';
import City from '../DB/models/cityModel';

const log = debug('log:v1');

// 5e6aa5e6075d200d2a9d7530

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
    if (country && city) {
      const image = await fs.promises.readFile(
        `/root/repos/fans_club/routes/logo/${country + city + name}.png`,
        (err, img) => (image = img)
      );
      if (!image) {
        await fs.promises.readFile(
          `/root/repos/fans_club/routes/logo/${country + city + name}.jpg`,
          (err, img) => (image = img)
        );
      }

      if (!image) {
        console.log('---------------------', errRead);
        return cb(200, { club, errRead: 'no image has been found' });
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
    }
    return cb(200, club);
  });
}
