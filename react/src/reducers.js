import { combineReducers } from 'redux';
import user from './reducers/user';
import signup from './reducers/singup';
import map from './reducers/map';
import club from './reducers/club';

export default combineReducers({
  user,
  signup,
  club,
  map,
});
