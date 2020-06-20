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

    const latestLikes = await Likes.find({})
      .sort({ date: 1 })
      .limit(10)
      .exec();
    const latestDislikes = await Dislikes.find({})
      .sort({ date: 1 })
      .limit(10)
      .exec();

    console.log({ countDislikes, countLikes, latestLikes, latestDislikes });
  } catch (error) {
    console.log(error);
  }
}
