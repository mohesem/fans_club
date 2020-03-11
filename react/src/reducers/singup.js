export default (
  state = {
    phone_number: undefined,
    location: undefined,
    address: undefined,
    submitButtonState: false,
    country_code: undefined,
  },
  action
) => {
  switch (action.type) {
    case 'UPDATE_SIGNUP':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
