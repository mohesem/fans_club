function updateCenter(payload) {
  return {
    type: 'UPDATE_CENTER',
    payload,
  };
}

function updateFlyTo(payload) {
  return {
    type: 'UPDATE_FLYTO',
    payload,
  };
}

function updateFlyToClub(payload) {
  return {
    type: 'UPDATE_FLYTOCLUB',
    payload,
  };
}

export default {
  updateCenter,
  updateFlyTo,
  updateFlyToClub,
};
