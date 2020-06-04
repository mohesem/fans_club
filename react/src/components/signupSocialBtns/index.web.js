import React from 'react';
import {StyleSheet} from 'react-native';
import {GoogleLogin} from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import {useDispatch} from 'react-redux';
import {Button, Text} from 'native-base';
import colors from '../../native-base-theme/colors';
import {signupInfoAction} from '../../redux/actions';

// api
import isUserNewApi from '../../api/isUserNew';
import isUserNewFbApi from '../../api/isUserNewFb';

const styles = StyleSheet.create({
  google: {
    width: 250,
    backgroundColor: 'white',
    alignSelf: 'center',
    placeContent: 'center',
    shadowColor: colors.brandDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
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
    width: 250,
    backgroundColor: '#3b5998',
    alignSelf: 'center',
    placeContent: 'center',
    shadowColor: colors.brandDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
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
  return new Promise((resolve, reject) => {
    isUserNewApi(email).then(res => {
      if (res.data.err) {
        reject(res.data.other);
      } else {
        resolve();
      }
    });
  });
};

const checkUserIsNewFb = facebookId => {
  return new Promise((resolve, reject) => {
    isUserNewFbApi(facebookId).then(res => {
      if (res.data.err) {
        reject(res.data.other);
      } else {
        resolve();
      }
    });
  });
};

export const GoogleLoginBtn = props => {
  const dispatch = useDispatch();
  const responseGoogle = response => {
    console.log(response);
    if (!response.error) {
      checkUserIsNew(response.profileObj.email)
        .then(() => {
          console.log(response);
          const user = {
            from: 'google',
            email: response.profileObj.email,
            firstname: response.profileObj.givenName,
            lastname: response.profileObj.familyName,
            fullname: response.profileObj.name,
            thumbnail: response.profileObj.imageUrl,
            googleId: response.profileObj.googleId,
          };
          dispatch(signupInfoAction(user));
        })
        .catch(err => {
          props.handleWait(false);
          props.handleOtherErrors(err);
        });
    } else {
      props.handleWait(false);
    }
  };

  return (
    <GoogleLogin
      render={renderProps => (
        <Button
          onPress={() => {
            props.handleWait(true);
            renderProps.onClick();
          }}
          disabled={renderProps.disabled}
          style={styles.google}>
          <Text style={styles.googleText}>SIGNUP WITH GOOGLE</Text>
        </Button>
      )}
      clientId="951334179095-56e83hvmusamr0scc8pb2al139p9v1hd.apps.googleusercontent.com"
      buttonText="LOGIN WITH GOOGLE"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export const FacebookLoginBtn = props => {
  const dispatch = useDispatch();
  const responseFacebook = response => {
    console.log(response);
    if (!response.error) {
      checkUserIsNewFb(response.id)
        .then(() => {
          const user = {
            from: 'facebook',
            email: response.email,
            firstname: response.first_name,
            lastname: response.last_name,
            fullname: response.name,
            thumbnail: response.picture.data.url,
            facebookId: response.id,
          };
          dispatch(signupInfoAction(user));
        })
        .catch(err => props.handleOtherErrors(err));
    } else {
      props.handleWait(false);
    }
  };

  return (
    <FacebookLogin
      appId="566163224103232"
      fields="first_name,last_name,name,email,picture"
      //   onClick={componentClicked}
      callback={responseFacebook}
      render={renderProps => (
        <Button
          onPress={() => {
            props.handleWait(true);
            renderProps.onClick();
          }}
          disabled={renderProps.disabled}
          style={styles.facebook}>
          <Text style={styles.facebookText}>SIGNUP WITH FACEBOOK</Text>
        </Button>
      )}
    />
  );
};
