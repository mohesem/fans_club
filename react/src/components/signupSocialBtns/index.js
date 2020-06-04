import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Text, View, Row} from 'native-base';
import {useDispatch} from 'react-redux';
import colors from '../../myTheme/colors';

import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';

// api
import isUserNewApi from '../../api/isUserNew';
import isUserNewFbApi from '../../api/isUserNewFb';

import {signupInfoAction} from '../../redux/actions';

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

const checkUserIsNew = email => {
  console.log('checkIsUserNew');
  return new Promise((resolve, reject) => {
    isUserNewApi(email).then(res => {
      // console.log(res);
      if (res.data.err) {
        reject(res.data.other);
      } else {
        resolve();
      }
    });
  });
};

const checkUserIsNewFb = facebookId => {
  console.log('checkIsUserNew');
  return new Promise((resolve, reject) => {
    isUserNewFbApi(facebookId).then(res => {
      // console.log(res);
      if (res.data.err) {
        reject(res.data.other);
      } else {
        resolve();
      }
    });
  });
};

const signOut = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    console.error(error);
  }
};

export const GoogleLoginBtn = props => {
  const dispatch = useDispatch();

  GoogleSignin.configure({
    webClientId:
      '434006094164-jsnovosa0adtmia7jlqhea3ctrti3ta0.apps.googleusercontent.com',
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });

  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // console.log('==================================================');
      const userInfo = await GoogleSignin.signIn();
      // console.log('user inpfio is ::::: ', userInfo);
      // console.log(userInfo.user.email);
      await signOut();

      checkUserIsNew(userInfo.user.email)
        .then(() => {
          const user = {
            from: 'google',
            email: userInfo.user.email,
            firstname: userInfo.user.givenName,
            lastname: userInfo.user.familyName,
            fullname: userInfo.user.name,
            thumbnail: userInfo.user.photo,
            googleId: userInfo.user.id,
          };

          dispatch(signupInfoAction(user));

          // console.log('-----------', user);

          dispatch(signupInfoAction(user));
        })
        .catch(err => {
          props.handleWait(false);
          props.handleOtherErrors(err);
        });
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

  // return <GoogleSigninButton onPress={signIn} style={styles.googleBtn} />;
  return (
    <Button
      block
      onPress={() => {
        props.handleWait(true);
        signInGoogle();
      }}
      // disabled={renderProps.disabled}
      style={styles.google}>
      <Text style={styles.googleText}>SIGNUP WITH GOOGLE</Text>
    </Button>
  );
};

export const FacebookLoginBtn = props => {
  const dispatch = useDispatch();
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
          checkUserIsNewFb(res.id)
            .then(() => {
              console.log('newwwww user');
              // signOut();
              const user = {
                from: 'facebook',
                email: res.email,
                firstname: res.first_name,
                lastname: res.last_name,
                fullname: res.name,
                thumbnail: res.picture.data.url,
                facebookId: res.id,
              };
              dispatch(signupInfoAction(user));
              LoginManager.logOut();
            })
            .catch(_err => {
              props.handleWait(false);
              props.handleOtherErrors(_err);
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
            // console.log(
            //   '==> Login success with permissions: ' +
            //     result.grantedPermissions.toString(),
            // );
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
      <Text style={styles.facebookText}>SIGNUP WITH FACEBOOK</Text>
    </Button>
    // <View>
    //   <LoginButton
    //     style={styles.facebookBtn}
    //     onLoginFinished={(error, result) => signinFacebook(error, result)}
    //     onLogoutFinished={() => console.log('logout.')}
    //   />
    // </View>
  );
};
