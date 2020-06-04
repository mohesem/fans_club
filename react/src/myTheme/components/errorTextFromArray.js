import React from 'react';
import { Text } from 'react-native';
import colors from '../colors';
import theme from '../theme';

export default props => {
  const style = {
    fontFamily: theme.fontFamily,
    fontSize: 12,
    color: colors.brandDanger,
    marginLeft: 10,
    marginTop: 10
  };

  const errorsObject = props.errors;
  return Object.keys(errorsObject).map((v, i) => {
    return (
      <Text style={style} key={i}>
        {errorsObject[v]}
      </Text>
    );
  });
};
