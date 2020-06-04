/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React, {useState} from 'react';
import {TextInput} from 'react-native';
import colors from '../colors';
import theme from '../theme';
import mergeFunctions from '../helpers/mergeFunctions';

export default props => {
  const [state, setState] = useState({});

  /* -------------------------------------------------------------------------- */
  /*                              default variables                             */
  /* -------------------------------------------------------------------------- */
  const defaultStyle = {
    height: 40,
    borderColor: colors.bws4,
    borderWidth: 2,
    paddingLeft: 5,
    paddingRight: 5,
    fontFamily: theme.fontFamily,
    marginTop: 10,
    marginBottom: 5,
  };

  // const props.userStyle = {};
  const onFocusStyle = {
    borderWidth: 0,
  };

  /* -------------------------------------------------------------------------- */
  /*                            style based on props                            */
  /* -------------------------------------------------------------------------- */
  if (props.variant) {
    switch (props.variant) {
      case 'primary':
        props.userStyle.borderColor = colors.brandPrimary;
        break;
      case 'success':
        props.userStyle.borderColor = colors.brandSuccess;
        break;
      case 'danger':
        props.userStyle.borderColor = colors.brandDanger;
        break;
      case 'warning':
        props.userStyle.borderColor = colors.brandWarning;
        break;
      case 'info':
        props.userStyle.borderColor = colors.brandInfo;
        break;
      default:
        break;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  hanadlers                                 */
  /* -------------------------------------------------------------------------- */
  const handleFocus = () => {
    setState({...state, focus: true});
  };

  const handleBlur = () => {
    setState({...state, focus: false});
  };

  const mainProps = {
    onChangeText: props.onChangeText || undefined,
    value: props.value || '',
    onFocus: props.onFocus
      ? mergeFunctions(props.onFocus, handleFocus)
      : handleFocus,
    onBlur: handleBlur,
    key: props.key || undefined,
    secureTextEntry: props.secureTextEntry || undefined,
    keyboardType: props.keyboardType || undefined,
    disabled: props.disabled || undefined,
    placeholder: props.placeholder || '',
  };

  const style = (() => {
    if (state.focus === true) {
      return {...defaultStyle, ...props.userStyle, ...onFocusStyle};
    }
    if (props.error) {
      return {
        ...defaultStyle,
        ...props.userStyle,
        ...{borderColor: colors.brandDanger},
      };
    }
    if (props.disabled) {
      return {
        ...defaultStyle,
        ...props.userStyle,
        ...{borderColor: colors.bws5, opacity: 0.7},
      };
    }
    return {...defaultStyle, ...props.userStyle};
  })();

  return <TextInput {...mainProps} style={style} />;
};
