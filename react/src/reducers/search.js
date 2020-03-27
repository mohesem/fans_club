export default (state = 'team', action) => {
  switch (action.type) {
    case 'UPDATE_SEARCH':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
