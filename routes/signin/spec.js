import validator from '../validator';

export default body => {
  const rulesObj = [
    { value: body.googleId || body.facebookId, name: 'id', required: true, type: 'string' },
  ];
  return validator(rulesObj);
};

// const rulesObj = [
//   { value: body.from, name: 'from', required: true, type: 'string' },
//   { value: body.email, name: 'email', required: true, email: true },
//   { value: body.firstname, name: 'firstname', required: true, type: 'string' },
//   { value: body.lastname, name: 'lastname', required: true, type: 'string' },
//   { value: body.fullname, name: 'fullname', required: true, type: 'string' },
//   { value: body.picture, name: 'picture', required: true, type: 'string' },
//   { value: body.thumbnail, name: 'thumbnail', required: true, type: 'string' },
//   { value: body.googleId || body.facebookId, name: 'id', required: true, type: 'string' },
//   {
//     value: body.location,
//     name: 'location',
//     required: true,
//     type: 'object',
//     length: 2,
//     keys: [
//       { value: 'lng', type: 'number' },
//       { value: 'lat', type: 'number' },
//     ],
//   },
//   { value: body.address, name: 'address', required: true, type: 'string' },
//   { value: body.birth, name: 'birth', required: true },
//   { value: body.gender, name: 'gender', required: true, type: 'string' },
// ];
