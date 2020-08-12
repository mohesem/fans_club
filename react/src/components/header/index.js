import React, {useEffect, useReducer} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {StyleSheet, Platform, Image, AsyncStorage} from 'react-native';
import {Header, Left, Text, Right, Button, Icon, Body, Toast} from 'native-base';
import colors from '../../native-base-theme/colors';

import IconReactNative from 'react-native-vector-icons/FontAwesome';
import {FontAwesomeIcon as IconReact} from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faTshirt,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

import {useHistory} from '../../router';
import {isUserAction, userAction} from '../../redux/actions';

const styles = StyleSheet.create({
  header: {
    // clearing bottom /shadow
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 0,
    // adding bottom border
    borderBottomWidth: 4,
    borderBottomColor: colors.brandPrimary,
    // marginBottom: 30,
    // height: Platform.OS === 'android' ? 80 : null,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: colors.brandGray,
    zIndex: 20,
  },
  btnTxt: {
    color: colors.brandLight,
    fontWeight: 'bold',
  },

  headerLeft: {
    flexDirection: 'row',
  },
  logo: {width: 130, height: 28},
  userImgTumbnail: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginTop: 5,
    marginLeft: 10,
  },
});
export default props => {
  const history = useHistory();
  const dispatch = useDispatch();

  // // TODO: delete later
  // useEffect(() => {
  //   history.push('/clubs');
  // }, [history]);

  /* -------------------------------------------------------------------------- */
  /*                                  reducers                                  */
  /* -------------------------------------------------------------------------- */
  const mediaReducer = useSelector(global => global.media);
  const isUserReducer = useSelector(global => global.isUser);
  const userReducer = useSelector(global => global.user);

  useEffect(() => {
    if (!Object.keys(userReducer).length) {
      Toast.show({
        text: 'Please Signup!',
        // buttonText: 'Okay',
        type: 'danger',
      });
    } else {
      Toast.show({
        text: `Hello ${userReducer.firstname}`,
        // buttonText: 'Okay',
        type: 'success',
      });
    }
  }, [userReducer]);

  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */
  const handleMenuToggle = () => {
    props.handleOepningDrawer();
  };

  const handleSignout = async () => {
    dispatch(isUserAction(false));
    dispatch(userAction({}));

    if (Platform.OS === 'web') {
      localStorage.removeItem('fans-club');
    } else {
      await AsyncStorage.removeItem('fans-club');
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               sub components                               */
  /* -------------------------------------------------------------------------- */
  // const Logo = () => <Image style={styles.logo} source={require('../../assets/sampleLogo.png')} />;
  const Logo = () => (
    <Button transparent onPress={() => history.push('/')}>
      <Image style={styles.logo} source={require('../../assets/logoandlogotype.png')} />
    </Button>
  );

  const SignupButton = () => (
    <Button transparent primary onPress={() => history.push('/Signup')}>
      <IconReact icon={faUserPlus} color={colors.brandLight} />
      <Text style={styles.btnTxt}>CREATE AN ACCOUNT</Text>
    </Button>
  );

  const SigninButton = () => (
    <Button transparent primary onPress={() => history.push('/Signin')}>
      <IconReact icon={faSignInAlt} color={colors.brandLight} />
      <Text style={styles.btnTxt}>SIGN IN</Text>
    </Button>
  );

  const ClubsButton = () => (
    <Button transparent primary onPress={() => history.push('/clubs')}>
      <IconReact icon={faTshirt} color={colors.brandLight} />
      <Text style={styles.btnTxt}>PROFILE</Text>
    </Button>
  );

  const SignoutButton = () => (
    <Button
      transparent
      primary
      onPress={() => {
        handleSignout();
        history.push('/');
      }}>
      <IconReact icon={faSignOutAlt} color={colors.brandLight} />
      <Text style={styles.btnTxt}>SIGN OUT</Text>
    </Button>
  );

  const UserImage = () => {
    console.log(userReducer.thumbnail);
    return <Image style={styles.userImgTumbnail} source={{uri: userReducer.thumbnail}} />;
  };

  const SmMenuButton = () => {
    return (
      <>
        {Platform.OS !== 'web' ? (
          <Button transparent primary onPress={handleMenuToggle}>
            <Icon name="bars" type="FontAwesome" />
            {/* <IconReact
              icon={faBars}
              color={props.searchMode === 'team' ? colors.brandLight : '#263238'}
            /> */}
          </Button>
        ) : (
          <Button transparent primary onClick={props.handleWebMenuOpen}>
            {/* <Icon name="bars" type="FontAwesome" /> */}
            <IconReact icon={faBars} color={colors.brandLight} />
          </Button>
        )}
      </>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                               main components                              */
  /* -------------------------------------------------------------------------- */
  const LgBody = () => {
    return (
      <>
        <Left style={styles.headerLeft}>
          {isUserReducer ? (
            <>
              {userReducer ? <UserImage /> : null}
              <SignoutButton />
              <ClubsButton />
            </>
          ) : (
            <>
              <SignupButton />
              <SigninButton />
            </>
          )}
        </Left>
        <Body />
        <Right>
          <Logo />
        </Right>
      </>
    );
  };
  const SmBody = () => {
    return (
      <>
        <Left>
          <SmMenuButton />
        </Left>
        <Body />
        <Right>
          <Logo />
        </Right>
      </>
    );
  };
  const AppHeader = () => {
    if (mediaReducer === 'sm') {
      return (
        <Header style={styles.header}>
          <SmBody />
        </Header>
      );
    }
    return (
      <Header style={styles.header}>
        <LgBody />
      </Header>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   return                                   */
  /* -------------------------------------------------------------------------- */
  return <AppHeader style={{zIndex: 20}} />;
};
