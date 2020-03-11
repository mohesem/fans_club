import { Schema, model } from 'mongoose';
import GeoJSON from 'mongoose-geojson-schema';

const userSchema = new Schema({
  geo: { type: Schema.Types.Point, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fullname: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  thumbnail: { type: String },
  picture: { type: String },
  birth: { type: Date, required: true },
  gender: { type: String, required: true },
  facebookId: { type: String },
  googleId: { type: String },
  activatedOn: { type: Date, default: new Date() },
  likes: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  suggests: [{ type: Schema.Types.ObjectId, ref: 'Suggest' }],
});

const User = model('User', userSchema);

export default User;
