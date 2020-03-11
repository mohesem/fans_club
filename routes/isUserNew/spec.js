import validator from '../validator';

export default email => {
  const rulesObj = [{ value: email, name: 'email', required: true, email: true }];
  return validator(rulesObj);
};
