import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import Sidebar from 'react-sidebar';

const sidebarStyle = {background: 'white'};

export default props => {
  const Media = useSelector(global => global.media);
  const [toggle, setToggle] = useState(false);
  const [dummyNumber, setDummyNumber] = useState(0);
  useEffect(() => {
    if (props.dummyNumber !== dummyNumber) {
      setDummyNumber(props.dummyNumber);
      setToggle(!toggle);
    }
  }, [dummyNumber, props.dummyNumber, toggle]);

  useEffect(() => {
    const trackClick = e => {
      if (e.target.id === 'webDrawerOverlay') {
        setToggle(!toggle);
      }
    };
    if (toggle) {
      window.addEventListener('click', trackClick);
      return () => window.removeEventListener('click', trackClick);
    }
  }, [toggle]);

  // close toggle on changing media size
  useEffect(() => {
    setToggle(false);
  }, [Media]);

  return (
    <Sidebar
      sidebar={<b>Sidebar content</b>}
      open={toggle}
      overlayId="webDrawerOverlay"
      //   onSetOpen={this.onSetSidebarOpen}
      styles={{sidebar: sidebarStyle}}
    />
  );
};
