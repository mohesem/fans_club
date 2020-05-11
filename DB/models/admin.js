import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
  username: { type: String },
  password: { type: String },
});

const Admin = model('User', adminSchema);

export default Admin;
