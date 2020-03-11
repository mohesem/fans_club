export default (
  state = {
    center: undefined,
    flyTo: { state: false, coord: undefined },
    flyToClub: {
      state: false,
      coord: undefined,
    },
  },
  action
) => {
  switch (action.type) {
    case 'UPDATE_CENTER':
      return { ...state, center: action.payload };
    case 'UPDATE_FLYTO':
      return { ...state, flyTo: action.payload };
    case 'UPDATE_FLYTOCLUB':
      return { ...state, flyToClub: action.payload };
    default:
      return state;
  }
};
