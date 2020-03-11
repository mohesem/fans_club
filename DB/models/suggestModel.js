/* eslint-disable camelcase */
import { Schema, model } from 'mongoose';

const suggestSchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  messages: [
    { text: { type: String }, seen: { type: Boolean, default: false }, date: { type: Date } },
  ],
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Suggest = model('Suggest', suggestSchema);

export default Suggest;
