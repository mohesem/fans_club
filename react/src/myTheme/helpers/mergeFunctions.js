/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-rest-params */
export default function merge() {
  const listOfFuncs = [];
  for (const func of arguments) {
    listOfFuncs.push(func);
  }
  return function returnMerge() {
    for (const func of listOfFuncs) {
      func(arguments);
    }
  };
}
