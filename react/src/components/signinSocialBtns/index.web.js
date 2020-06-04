import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {GoogleLogin} from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import {useDispatch} from 'react-redux';
import {Button, Text} from 'native-base';
import {useHistory} from '../../router';

import colors from '../../native-base-theme/colors';

// api
import signinApi from '../../api/signin';

import {userAction, isUserAction} from '../../redux/actions';

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

export const GoogleLoginBtn = props => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleError = err => {
    console.log(err);
    props.handleWait(false);
  };

  const handleResponse = userObject => {
    console.log(userObject);
    signinApi(userObject.googleId)
      .then(res => {
        localStorage.setItem('fans-club', res.data.token);
        const user = {
          firstname: res.data.first_name,
          lastname: res.data.last_name,
          thumbnail: res.data.thumbnail,
          location: res.data.location,
          likes: res.data.likes,
          dislikes: res.data.dislikes,
        };
        dispatch(userAction(user));
        dispatch(isUserAction(true));
        history.push('/');
      })
      .catch(err => {
        console.log('eeeeeeeeeeeeeee', err);
      });
    props.handleWait(false);
  };

  const responseGoogle = response => {
    console.log(response);
    if (!response.error) {
      handleResponse(response.profileObj);
    } else {
      handleError(response.error);
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
      clientId="951334179095-359plh303nv4b6oi184594gi11jmpvfk.apps.googleusercontent.com"
      buttonText="LOGIN WITH GOOGLE"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export const FacebookLoginBtn = props => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleError = err => {
    console.log(err);
    props.handleWait(false);
  };

  const handleReponse = response => {
    signinApi(response.id)
      .then(res => {
        localStorage.setItem('fans-club', res.data.token);
        const user = {
          firstname: res.data.first_name,
          lastname: res.data.last_name,
          thumbnail: res.data.thumbnail,
          location: res.data.location,
          likes: res.data.likes,
          dislikes: res.data.dislikes,
        };
        dispatch(userAction(user));
        dispatch(isUserAction(true));
        history.push('/');
      })
      .catch(err => console.log('eeeeeeeeeeeee', err));
  };

  const responseFacebook = response => {
    console.log(response);
    if (!response.error) {
      handleReponse(response.id);
    } else {
      handleError(response.error);
    }
  };

  return (
    <FacebookLogin
      appId="726965834493962"
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
