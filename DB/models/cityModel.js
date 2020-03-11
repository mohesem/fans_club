import { Schema, model } from 'mongoose';
import GeoJSON from 'mongoose-geojson-schema';

const citySchema = new Schema({
  country: { type: String },
  name: { type: String },
  geo: Schema.Types.Point,
  cn: { type: String, unique: true },
});

citySchema.index({ geo: '2dsphere' });
citySchema.index({ name: 1 });
citySchema.index({ country: 1 });
citySchema.index({ cn: 1 });

const City = model('City', citySchema);

export default City;
