/* eslint-disable react/destructuring-assignment */
import React, {useState} from 'react';
import {TouchableOpacity, Text, Platform} from 'react-native';
import colors from '../colors';
import theme from '../theme';

export default props => {
  const [state, setState] = useState({});

  const touchableOpacityDefaultStyle = {
    backgroundColor: colors.bws4,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 10,
    marginBottom: 10,
    width: Platform.OS === 'web' ? 'fit-content' : undefined,
  };

  const defaultTextStyle = {
    fontFamily: theme.fontFamily,
  };

  const touchableOpacityUserStyle = {};

  if (props.variant) {
    switch (props.variant) {
      case 'primary':
        touchableOpacityUserStyle.backgroundColor = colors.brandPrimary;
        break;
      case 'success':
        touchableOpacityUserStyle.backgroundColor = colors.brandSuccess;
        break;
      case 'danger':
        touchableOpacityUserStyle.backgroundColor = colors.brandDanger;
        break;
      case 'warning':
        touchableOpacityUserStyle.backgroundColor = colors.brandWarning;
        break;
      case 'info':
        touchableOpacityUserStyle.backgroundColor = colors.brandInfo;
        break;
      default:
        break;
    }
  }

  if (state.disabled !== props.disabled) {
    setState({...state, disabled: props.disabled});
  }

  const touchableOpacityStyle = (() => {
    if (state.disabled) {
      return {
        ...touchableOpacityDefaultStyle,
        ...touchableOpacityUserStyle,
        backgroundColor: colors.bws5,
      };
    }
    return {...touchableOpacityDefaultStyle, ...touchableOpacityUserStyle};
  })();

  const mainProps = {
    onPress: state.disabled ? null : props.onPress || undefined,
    disable: props.disabled || undefined,
  };

  return (
    <TouchableOpacity
      {...mainProps}
      style={touchableOpacityStyle}
      activeOpacity={state.disabled ? 1 : 0.7}>
      <Text style={defaultTextStyle}>{props.title}</Text>
    </TouchableOpacity>
  );
};

//  onPress={!disabled && onPress}
