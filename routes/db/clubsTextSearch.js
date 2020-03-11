import debug from 'debug';
import Club from '../../DB/models/teamsModel';

const log = debug('log:db');

export default function clubsTextSearch(str, cb) {
  Club.find({ name: { $regex: `^${str}.*`, $options: 'i' } })
    .sort({ name: 1 })
    .limit(10)
    .exec((err, teams) => {
      if (err) cb(err, null);
      else cb(null, teams);
    });
}
