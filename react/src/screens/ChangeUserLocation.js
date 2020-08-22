import React, {useState} from 'react';

import Map from '../components/getUserLocationMap';
import SearchBar from '../components/searchBarLocation';

import {Platform} from 'react-native';

export default () => {
  const [flyTo, setFlyTo] = useState([]);

  const handleFlyTo = center => {
    console.log(center);
    setFlyTo(center);
  };

  const searchBarProps = {
    handleFlyTo,
  };

  const mapProps = {
    flyTo,
    handleFlyTo,
  };

  /* -------------------------------------------------------------------------- */
  /*                                 components                                 */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <Map {...mapProps} />
      <SearchBar {...searchBarProps} />
      {/* <Footer /> */}
    </>
  );
};
