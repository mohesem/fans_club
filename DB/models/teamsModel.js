/* eslint-disable camelcase */
import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
  group: { type: String, required: true },
  country: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String },
  primary_color: { type: String, required: true },
  secondary_color: { type: String, required: true },
});

teamSchema.index({ name: 1 });

const Team = model('Team', teamSchema);

export default Team;
