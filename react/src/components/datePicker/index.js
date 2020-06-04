import React from 'react';

import {DatePicker} from 'native-base';

export default props => {
  return (
    <DatePicker
      defaultDate={new Date(0)}
      locale={'en'}
      timeZoneOffsetInMinutes={undefined}
      modalTransparent={false}
      animationType={'fade'}
      androidMode={'default'}
      textStyle={{color: 'green'}}
      placeHolderTextStyle={{color: '#d3d3d3'}}
      onDateChange={props.handleNewDate}
      disabled={false}
    />
  );
};
