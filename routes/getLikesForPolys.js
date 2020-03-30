import debug from 'debug';
import Like from '../DB/models/likeModel';

const log = debug('log:v1');

function getLikeNumbers(body) {
  const { reducedDuplicates, teamId } = body;
  const finalRes = {};
  return new Promise((resolve, reject) => {
    try {
      reducedDuplicates.forEach(async (fid, index) => {
        console.log('fiddddddddddddddddddd', fid);
        // console.log(reducedDuplicates.length - 1, index);
        await Like.countDocuments({ fid: Number(fid), team_id: teamId }, (err, res) => {
          if (err) console.log(err);
          // console.log(res);
          // finalRes.push({ fid: res });
          // console.log(finalRes);

          finalRes[fid] = res;
        });

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
