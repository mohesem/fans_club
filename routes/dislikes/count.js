import Dislike from '../../DB/models/dislikeModel';

const header = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Content-Type': 'application/json',
  // "Content-Encoding": "gzip"
};

const headerErr = { 'Content-Type': 'text/plain' };

export default async function(cb) {
  Dislike.countDocuments({}, (err, result) => {
    if (err) return cb(200, headerErr, { err: true, other: 'internal server error' });
    return cb(200, header, { err: false, count: result });
  });
}
