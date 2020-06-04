import React from 'react';
import {Button, Text} from 'native-base';
import {Platform, StyleSheet, View} from 'react-native';

import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import Header from '../header';
import Routes from '../../routes';

import {useHistory} from '../../router';

const TYPES = ['front', 'back', 'back', 'slide'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContainer: {
    flex: 1,
    paddingTop: 10,
  },
  drawerText: {
    margin: 10,
    fontSize: 15,
    textAlign: 'left',
  },
});

export default () => {
  const history = useHistory();
  let drawerRef = null;

  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */
  const handleOepningDrawer = () => {
    if (drawerRef !== null) {
      drawerRef.openDrawer();
    }
  };

  const handleRoutes = name => {
    drawerRef.closeDrawer();
    history.push(`/${name}`);
  };

  /* -------------------------------------------------------------------------- */
  /*                               sub components                               */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                               main components                              */
  /* -------------------------------------------------------------------------- */
  const renderDrawer = () => {
    return (
      <View style={styles.drawerContainer}>
        <Button transparent onPress={() => handleRoutes('Signup')}>
          <Text>ثبت نام</Text>
        </Button>
        <Button transparent onPress={() => handleRoutes('Signin')}>
          <Text>ورود</Text>
        </Button>
      </View>
    );
  };

  const drawerType = TYPES[0];
  return (
    <View style={styles.container}>
      <DrawerLayout
        ref={drawer => {
          drawerRef = drawer;
        }}
        drawerWidth={200}
        keyboardDismissMode="on-drag"
        drawerPosition={DrawerLayout.positions.Right}
        drawerType={drawerType}
        drawerBackgroundColor="#ddd"
        overlayColor="#00000066"
        renderNavigationView={renderDrawer}
        contentContainerStyle={
          // careful; don't elevate the child container
          // over top of the drawer when the drawer is supposed
          // to be in front - you won't be able to see/open it.
          drawerType === 'front'
            ? {}
            : Platform.select({
                ios: {
                  shadowColor: '#00000066',
                  shadowOpacity: 0.4,
                  shadowOffset: {width: 0, height: 2},
                  shadowRadius: 60,
                },
                android: {
                  elevation: 100,
                  backgroundColor: '#00000066',
                },
              })
        }>
        <Header handleOepningDrawer={handleOepningDrawer} />
        <Routes />
      </DrawerLayout>
    </View>
  );
};
