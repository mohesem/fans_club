import React, {useEffect} from 'react';
// import 'flatpickr/dist/themes/material_green.css';
import colors from '../../native-base-theme/colors';

import {useSelector} from 'react-redux';

import Flatpickr from 'react-flatpickr';

export default props => {
  const Media = useSelector(global => global.media);

  // useEffect(() => {
  //   document.querySelector('.');
  // }, [Media]);

  return (
    <Flatpickr
      onChange={props.handleNewDate}
      value={props.date}
      disableMobile="true"
      style={{
        border: 'none',
        alignSelf: 'flex-end',
        textAlign: 'center',
        fontSize: 'unset',
        padding: 15,
        textDecoration: 'underline',
        fontWeight: 'bold',
        backgroundColor: colors.brandPrimary,
        color: colors.brandLight,
        alignSelf: 'center',
        margin: 10,
      }}
    />
  );
};
