export default (
  state = {
    cityName: undefined,
    countyName: undefined,
    cityCoords: undefined,
    clubGroup: undefined,
    clubName: undefined,
    primaryColor: undefined,
    secondaryColor: undefined,
    logoBase64: undefined,
  },
  action
) => {
  switch (action.type) {
    case 'UPDATE_CLUB':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
