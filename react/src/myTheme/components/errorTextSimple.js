import React from 'react';
import { Text } from 'react-native';
import colors from '../colors';
import theme from '../theme';

export default props => {
  const style = {
    fontFamily: theme.fontFamily,
    fontSize: 12,
    color: colors.brandLight,
    backgroundColor: colors.brandDanger,
    padding: 7
  };

  return props.error ? <Text style={style}>{props.error}</Text> : null;
};
