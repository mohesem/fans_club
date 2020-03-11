import debug from 'debug';
import fs from 'fs';
import Teams from '../DB/models/teamsModel';
import City from '../DB/models/cityModel';

const log = debug('log:v1');

export default function getClub(teamId, cb) {
  Teams.findById(teamId, (err, club) => {
    if (err) {
      log(`error on finding club \n ${err}`);
      return cb(500, 'error on finding club');
    }
    const { city, group, country, name } = club;
    // city.trim();
    // country.trim();
    // name.trim();

    log('@@@@@@@@@@@@@@@@@@@@@@@@', country, city);
    if (group === 'AFC' && country && city) {
      fs.readFile(
        `/home/emad/Documents/projects/FANS_CLUB_LAST/fans_club_back_last/routes/logo/${country +
          city +
          name}.png`,
        (errRead, img) => {
          if (errRead) {
            log('---------------------', errRead);
            return cb(200, { club, errRead });
          }
          City.findOne(
            {
              country: country.trim(),
              name: city.trim(),
            },
            async (errCity, cityObj) => {
              if (err) {
                log('--------------- finding City', err);
                return cb(200, { club, errCity });
              }
              if (!cityObj) {
                log('--------------- no city has been found', cityObj);
                return cb(200, { club, errCity });
              }
              const base64Image = Buffer.from(img).toString('base64');

              // Buffer.from(img, 'binary').toString('base64');

              log('-----------------', cityObj);
              return cb(200, { city: cityObj, club, base64Image });

              // TODO: send new json with club, city and buffer
            }
          );
        }
      );
    } else {
      return cb(200, club);
    }
  });
}
