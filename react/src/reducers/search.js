export default (state = 'like', action) => {
  switch (action.type) {
    case 'UPDATE_SEARCH':
      return action.payload;
    default:
      return state;
  }
};
