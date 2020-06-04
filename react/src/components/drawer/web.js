import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Text, View} from 'native-base';
import {userAction, isUserAction} from '../../redux/actions';

import {useHistory} from '../../router';

import Sidebar from 'react-sidebar';

const sidebarStyle = {background: 'white', zIndex: 1000};
const bodyStyle = {
  width: 180,
  height: '-webkit-fill-available',
};
export default props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const Media = useSelector(global => global.media);
  const isUserReducer = useSelector(global => global.isUser);

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
      setToggle(!toggle);
      // if (e.target.id !== 'webSidebar') {
      // }
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

  const handleSignout = async () => {
    dispatch(isUserAction(false));
    dispatch(userAction({}));
    localStorage.removeItem('fans-club');
    history.push('/map');
  };

  const Body = () => {
    return (
      <View padder style={bodyStyle} id="webSidebar">
        {isUserReducer ? (
          <>
            <Button transparent block onPress={handleSignout}>
              <Text>SIGNOUT</Text>
            </Button>
            <Button transparent block onPress={() => history.push('/clubs')}>
              <Text>CLUBS</Text>
            </Button>
          </>
        ) : (
          <>
            <Button transparent block onPress={() => history.push('/signin')}>
              <Text>SIGNIN</Text>
            </Button>
            <Button transparent block onPress={() => history.push('/signup')}>
              <Text>SIGNUP</Text>
            </Button>
          </>
        )}
      </View>
    );
  };

  return (
    <Sidebar
      sidebar={<Body />}
      open={toggle}
      overlayId="webDrawerOverlay"
      pullRight
      touchHandleWidth={0}
      //   onSetOpen={this.onSetSidebarOpen}
      styles={{sidebar: sidebarStyle}}
    />
  );
};
