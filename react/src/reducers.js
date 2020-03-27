import { combineReducers } from 'redux';
import user from './reducers/user';
import signup from './reducers/singup';
import map from './reducers/map';
import club from './reducers/club';
import search from './reducers/search';

export default combineReducers({
  user,
  signup,
  club,
  map,
  search,
});
