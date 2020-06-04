export const mediaAction = payload => {
  return {
    type: 'SET_MEDIA',
    payload,
  };
};

export const centerAction = payload => {
  return {
    type: 'SET_CENTER',
    payload,
  };
};

export const userLocationAction = payload => {
  return {
    type: 'SET_USER_LOCATION',
    payload,
  };
};

export const signupInfoAction = payload => {
  return {
    type: 'SET_SIGNUP_INFO',
    payload,
  };
};

export const isUserAction = payload => {
  return {
    type: 'SET_IS_USER',
    payload,
  };
};

export const userAction = payload => {
  return {
    type: 'SET_USER',
    payload,
  };
};
