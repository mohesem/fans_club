import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
  username: { type: String },
  password: { type: String },
});

const Admin = model('Admin', adminSchema);

export default Admin;
