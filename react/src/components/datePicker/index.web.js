// import React from 'react';
// // import 'flatpickr/dist/themes/material_green.css';
// import colors from '../../native-base-theme/colors';

// import {useSelector} from 'react-redux';

// import Flatpickr from 'react-flatpickr';

// export default props => {
//   return (
//     <Flatpickr
//       onChange={props.handleNewDate}
//       onClick={() => console.log('clicked')}
//       value={props.date}
//       disableMobile="true"
//       style={{
//         border: 'none',
//         // alignSelf: 'flex-end',
//         textAlign: 'center',
//         fontSize: 'unset',
//         padding: 15,
//         textDecoration: 'underline',
//         fontWeight: 'bold',
//         backgroundColor: colors.brandPrimary,
//         color: colors.brandLight,
//         alignSelf: 'center',
//         margin: 10,
//         // zIndex: 100000000,
//       }}
//     />
//   );
// };

import React, {useState} from 'react';
import DatePicker from 'react-date-picker';

export default props => {
  return <DatePicker onChange={props.handleNewDate} value={props.date} />;
};
