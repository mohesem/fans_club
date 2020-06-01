import validator from '../validator';

export default facebookId => {
  const rulesObj = [{ value: facebookId, name: 'facebook id', required: true }];
  return validator(rulesObj);
};
