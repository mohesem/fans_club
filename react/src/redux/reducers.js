import {combineReducers} from 'redux';

const mediaReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_MEDIA':
      return action.payload;
    default:
      return state;
  }
};

const centerReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_CENTER':
      return action.payload;
    default:
      return state;
  }
};

const userLocationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER_LOCATION':
      return action.payload;
    default:
      return state;
  }
};

const signupInfoReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_SIGNUP_INFO':
      return action.payload;
    default:
      return state;
  }
};

const isUserReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_IS_USER':
      return action.payload;
    default:
      return state;
  }
};

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  media: mediaReducer,
  center: centerReducer,
  userLocation: userLocationReducer,
  signupInfo: signupInfoReducer,
  isUser: isUserReducer,
  user: userReducer,
});
