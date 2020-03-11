import { Schema, model } from 'mongoose';
import GeoJSON from 'mongoose-geojson-schema';

const dislikeSchema = new Schema({
  geo: Schema.Types.Point,
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  boundy_id: { type: Schema.Types.ObjectId, ref: 'GeoJSON', required: true },
  team_id: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  name0: { type: String },
  name1: { type: String },
  name2: { type: String },
  fid: { type: String, require: true },
  date: { type: Date, default: new Date() },
  gender: { type: String },
});
// teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],

dislikeSchema.index({ geo: '2dsphere' }); // schema level
dislikeSchema.index({ user_id: 1 }); // schema level
dislikeSchema.index({ boundy_id: 1 }); // schema level
dislikeSchema.index({ team_id: 1 }); // schema level
dislikeSchema.index({ fid: 1 }); // schema level
dislikeSchema.index({ date: 1 }); // schema level
dislikeSchema.index({ gender: 1 });

const Dislike = model('Dislike', dislikeSchema);

export default Dislike;
