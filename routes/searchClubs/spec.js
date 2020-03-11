import validator from '../validator';

export default body => {
  const rulesObj = [{ value: body.str, name: 'str', required: true, type: 'string' }];
  return validator(rulesObj);
};
