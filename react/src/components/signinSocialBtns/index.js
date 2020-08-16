import React from 'react';
import {StyleSheet, AsyncStorage} from 'react-native';
import {useDispatch} from 'react-redux';
import colors from '../../myTheme/colors';
import {useHistory} from '../../router';
import {userAction, isUserAction} from '../../redux/actions';

import {Button, Text} from 'native-base';

import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk';

// api
import signinApi from '../../api/signin';

const styles = StyleSheet.create({
  google: {
    // width: 250,
    backgroundColor: 'white',
    alignSelf: 'center',
    // placeContent: 'center',
    shadowColor: colors.brandDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // margin: 10,
    marginTop: 15,
  },
  googleText: {
    color: colors.brandDark,
    flexGrow: 1,
    flexDirection: 'column',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  facebook: {
    // width: 250,
    backgroundColor: '#3b5998',
    alignSelf: 'center',
    // placeContent: 'center',
    shadowColor: colors.brandDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 15,
  },
  facebookText: {
    color: 'white',
    flexGrow: 1,
    flexDirection: 'column',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export const GoogleLoginBtn = props => {
  const dispatch = useDispatch();
  const history = useHistory();

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  GoogleSignin.configure({
    webClientId: '434006094164-jsnovosa0adtmia7jlqhea3ctrti3ta0.apps.googleusercontent.com',
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });
  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // console.log('user inpfio is ::::: ', userInfo);
      // console.log(userInfo.user.email);

      signinApi(userInfo.user.id)
        .then(async res => {
          console.log('------------------', res);
          await AsyncStorage.setItem('fans-club', res.data.token);
          const user = {
            firstname: res.data.first_name,
            lastname: res.data.last_name,
            thumbnail: res.data.thumbnail,
            location: res.data.location,
            likes: res.data.likes,
            dislikes: res.data.dislikes,
          };
          await signOut();
          dispatch(userAction(user));
          dispatch(isUserAction(true));
          history.push('/');
        })
        .catch(err => console.log('eeeeeeeeeeeeeeeeeeeeee', err));
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('step 1', error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('step 2', error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated

        console.log('step 3', error);
      } else {
        console.log('step 4', error);
        // some other error happened
      }
      props.handleWait(false);
    }
  };

  return (
    <Button
      block
      onPress={() => {
        props.handleWait(true);
        signInGoogle();
      }}
      style={styles.google}>
      <Text style={styles.googleText}>LOG IN WITH GOOGLE</Text>
    </Button>
  );
};

export const FacebookLoginBtn = props => {
  const dispatch = useDispatch();
  const history = useHistory();

  const getUserProfile = () => {
    const infoRequest = new GraphRequest(
      '/me?fields=first_name,last_name,name,picture,email,id',
      null,
      (err, res) => {
        if (err) {
          // console.log(err);
          props.handleWait(false);
        } else {
          console.log(res);
          signinApi(res.id)
            .then(resp => {
              console.log('&&&&&&&&&&&&&&&&&&&', resp);
              const user = {
                firstname: res.data.first_name,
                lastname: res.data.last_name,
                thumbnail: res.data.thumbnail,
                location: res.data.location,
                likes: res.data.likes,
                dislikes: res.data.dislikes,
              };
              LoginManager.logOut();
              dispatch(userAction(user));
              dispatch(isUserAction(true));
              history.push('/');
            })
            .catch(error => {
              console.log('eeeeeeeeeeeeeeeeeeeee', error);
            });
        }
      },
    );
    // Start the graph request.
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  const login = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then(
        function(result) {
          if (result.isCancelled) {
            console.log('==> Login cancelled');
            props.handleWait(false);
          } else {
            getUserProfile();
          }
        },
        function(error) {
          props.handleWait(true);
          // TODO: test
          props.handleOtherErrors({err: 'Login fail with error'});
          console.log('==> Login fail with error: ' + error);
        },
      )
      .catch(err => {
        props.handleWait(true);
        console.log('errrrr', err);
      });
  };

  return (
    <Button
      block
      onPress={() => {
        props.handleWait(true);
        login();
      }}
      style={styles.facebook}>
      <Text style={styles.facebookText}>LOG IN WITH FACEBOOK</Text>
    </Button>
  );
};
