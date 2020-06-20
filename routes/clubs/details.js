import Teams from '../../DB/models/teamsModel';
import Likes from '../../DB/models/likeModel';
import Dislikes from '../../DB/models/dislikeModel';

const header = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Content-Type': 'application/json',
};

const headerErr = { 'Content-Type': 'text/plain' };

export default async function(teamId, cb) {
  try {
    const countLikes = await Likes.countDocuments({ team_id: teamId });
    const countDislikes = await Dislikes.countDocuments({ team_id: teamId });
    console.log({ countDislikes, countLikes });
  } catch (error) {
    console.log(error);
  }

  Teams.countDocuments({}, (err, result) => {
    if (err) return cb(200, headerErr, { err: true, other: 'internal server error' });
    return cb(200, header, { err: false, count: result });
  });
}
