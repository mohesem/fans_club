import debug from 'debug';
import Like from '../DB/models/likeModel';
import Dislike from '../DB/models/dislikeModel';

const log = debug('log:v1');

function getLikeNumbers(body) {
  const { likeOrDislike, reducedDuplicates, teamId } = body;
  const finalRes = {};
  return new Promise((resolve, reject) => {
    try {
      reducedDuplicates.forEach(async (fid, index) => {
        if (likeOrDislike === 'like') {
          await Like.countDocuments({ fid, team_id: teamId }, (err, res) => {
            if (err) console.log(err);
            finalRes[fid] = res;
          });
        } else {
          await Dislike.countDocuments({ fid, team_id: teamId }, (err, res) => {
            if (err) console.log(err);
            finalRes[fid] = res;
          });
        }

        if (reducedDuplicates.length - 1 === index) {
          resolve(finalRes);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

export default function getLikesForPolys(body, cb) {
  getLikeNumbers(body)
    .then(res => {
      console.time('process is done');
      return cb(200, { likes: res });
    })
    .catch(e => {
      return cb(500, { msg: 'Internal Server Error', e });
    });
}
