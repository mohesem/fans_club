import validator from '../validator';

export default body => {
  const rulesObj = [
    { value: body.token, name: 'token', required: true, type: 'string' },
    {
      value: body.club,
      name: 'club',
      required: true,
      type: 'object',
      keys: [
        { value: '_id', type: 'string' },
        { value: 'group', type: 'string' },
        { value: 'name', type: 'string' },
        { value: 'city', type: 'string' },
        { value: 'primary_color', type: 'string' },
        { value: 'secondary_color', type: 'string' },
      ],
    },
  ];
  return validator(rulesObj);
};
