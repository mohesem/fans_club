import emailValidator from 'email-validator';

// TODO: using arrays is way more powerfull
// TODO: checking enums
// TODO: check arrays

export default function rules(arr) {
  const errors = {};
  return new Promise(resolve => {
    arr.forEach((a, i) => {
      if (a.required && !a.value) {
        errors[`${a.name}`] = `${a.name} is required`;
      } else if (a.minLength && a.value.length < a.minLength) {
        errors[`${a.name}`] = `${a.name} should have more than ${a.minLength} characters`;
      } else if (a.maxLength && a.value.maxLength > a.maxLength) {
        errors[`${a.name}`] = `${a.name} should have less than ${a.maxLength} characters`;
      } else if (a.length && a.type !== 'object' && a.value.length !== a.length) {
        errors[`${a.name}`] = `${a.name} should have ${a.length} characters`;
      } else if (a.type && typeof a.value !== a.type) {
        errors[`${a.name}`] = `${a.name} type should ba ${a.type}`;
      } else if (a.email && emailValidator.validate(a.value) === false) {
        errors[`${a.name}`] = `${a.name} is invalid`;
      } else if (a.type === 'object') {
        // NOTE: check length of object
        if (a.length && Object.keys(a.value).length !== a.length) {
          errors[`${a.name}`] = `${a.name} object length should be ${a.length}`;
        }
      } else if (a.type === 'object') {
        // NOTE: check object keys existance
        a.keys.forEach(key => {
          if (!a.value[key.name]) {
            errors[`${a.name}`] = `${key.name} should be a part of ${a.name}`;
          }
        });
      } else if (a.type === 'object') {
        // NOTE: check object keys value type
        a.keys.forEach(key => {
          if (typeof a.value[key.name] !== key.type) {
            errors[`${a.name}`] = `${key.name} type should be ${key.type}`;
          }
        });
      }

      if (i === arr.length - 1) {
        resolve(errors);
      }
    });
  });
}
