export default (
  state = {
    isVlaid: undefined,
    suggest: undefined,
    firstname: undefined,
    lastname: undefined,
    likes: [],
    dislikes: [],
    suggests: [],
    location: undefined,
  },
  action
) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
