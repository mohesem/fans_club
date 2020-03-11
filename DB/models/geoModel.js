import { Schema, model } from 'mongoose';
import GeoJSON from 'mongoose-geojson-schema';

const geoSchema = new Schema({
  name0: { type: String },
  name1: { type: String },
  name2: { type: String },
  geo: Schema.Types.MultiPolygon,
  fid: { type: Number, required: true },
});

geoSchema.index({ geo: '2dsphere' });
geoSchema.index({ fid: 1 });

const GeoModel = model('GeoJSON', geoSchema);

export default GeoModel;
