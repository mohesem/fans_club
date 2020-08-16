import React, {useState, useEffect} from 'react';

import {useSelector} from 'react-redux';
import {Grid, Col, Form, Button, Text, H3, ListItem, Left, Right, View, Spinner} from 'native-base';

import {ImageBackground, StyleSheet, Platform, Image, ScrollView, AsyncStorage} from 'react-native';
// import Input from '../myTheme/components/input';
import {useHistory} from '../router';
import colors from '../native-base-theme/colors';

import DatePicker from '../components/datePicker';

import MyModal from '../myTheme/components/modal';

import IconReactNative from 'react-native-vector-icons/FontAwesome';
import {FontAwesomeIcon as IconReact} from '@fortawesome/react-fontawesome';
import {faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons';

import {GoogleLoginBtn, FacebookLoginBtn} from '../components/signupSocialBtns';

// api
import makeNewUserApi from '../api/makeNewUser';

const styles = StyleSheet.create({
  imageBackParent: {
    height: 500,
    flex: 1,

    backgroundColor: 'red',
  },
  imageBack: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    zIndex: 1,
    position: 'absolute',
    top: 56,
    bottom: 0,
    left: 0,
    right: 0,
  },
  formLayoutParent: {
    position: 'absolute',
    top: 56,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    overflow: Platform.OS === 'web' ? 'auto' : null,
  },
  formCol: {
    // padding: 20,
  },
  viewCol: {
    backgroundColor: '#ecececf0',
    padding: 20,
    paddingBottom: 50,
  },
  secondaryText: {
    color: colors.brandGray,
    padding: 10,
  },
  title: {
    marginBottom: 10,
    marginTop: 10,
    fontWeight: 'bold',
  },
  absoluteView: {
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  form: {
    maxWidth: 400,
    alignSelf: 'center',
  },
  addressContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 15,
    marginBottom: 15,
    flexGrow: 1,
    borderWidth: 2,
    borderColor: 'lightgray',
    borderRadius: 20,
  },
  addressText: {
    alignSelf: 'center',
  },
  userInfoContainer: {
    backgroundColor: 'white',
    marginTop: 15,
    marginBottom: 15,
    flexGrow: 1,
    borderWidth: 2,
    borderColor: 'lightgray',
    borderRadius: 20,
    flexDirection: Platform.OS === 'web' ? 'row' : 'row-reverse',
  },
  userInfoText: {
    alignSelf: 'center',
    textAlign: 'center',
    flexGrow: 1,
    fontWeight: 'bold',
  },
  userInfoImg: {
    width: 94,
    height: 94,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  locationBtn: {
    marginTop: 15,
    marginBottom: 15,
    shadowColor: colors.brandDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  genderContainer: {
    marginBottom: 15,
  },
  submitBtn: {
    marginTop: 15,
    marginBottom: 15,
    shadowColor: colors.brandDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitBtnTxt: {
    fontWeight: 'bold',
  },
  error: {
    color: colors.brandDanger,
    fontSize: 14,
  },
});

export default () => {
  const history = useHistory();
  const UserLocation = useSelector(global => global.userLocation);
  const SignupInfo = useSelector(global => global.signupInfo);

  const Media = useSelector(global => global.media);

  const [sex, setSex] = useState(null);
  const [date, setDate] = useState(new Date(0));

  const [locationError, setLocationError] = useState('');
  const [signupInfoError, setSignupInfoError] = useState('');
  const [genderError, setGenderError] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [otherError, setOtherError] = useState('');

  const [wait, setWait] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */

  const handleNewDate = newDate => {
    setDate(newDate);
  };

  const handleOtherErrors = err => {
    setOtherError(err);
  };

  const handleShowModal = boolean => {
    setShowModal(boolean);
    if (boolean === false) {
      setOtherError('');
    }
  };

  const handleWait = boolean => {
    console.log('*****', boolean);
    setWait(boolean);
  };

  const handleErrors = () => {
    return new Promise(async (resolve, reject) => {
      let hasError = false;

      if (!UserLocation) {
        setLocationError('your location is required');
        hasError = true;
      } else if (locationError) {
        setLocationError('');
      }

      if (!SignupInfo) {
        setSignupInfoError('you should be authenticated to move on');
        hasError = true;
      } else if (signupInfoError) {
        setSignupInfoError('');
      }

      if (!sex) {
        setGenderError('please choose your gender');
        hasError = true;
      } else if (genderError) {
        setGenderError('');
      }

      if (hasError) {
        reject();
      } else {
        resolve();
      }
    });
  };

  const handleSubmit = () => {
    handleErrors()
      .then(() => {
        const finalUser = {
          ...SignupInfo,
          address: UserLocation.address,
          location: UserLocation.location,
          birth: date,
          gender: sex,
        };

        console.log(finalUser);

        makeNewUserApi(finalUser)
          .then(res => {
            console.log('==========================================', res);
            if (Platform.OS === 'web') {
              localStorage.setItem('fans-club', res.data.token);
            } else {
              (async () => {
                await AsyncStorage.setItem('fans-club', res.data.token);
                const token = await AsyncStorage.getItem('fans-club');
                console.log('%%%%%%%%%%', token);
              })();
            }
            // TODO: snackbar
            //enqueueSnackbar(`${res.data.snackMsg}`, { variant: 'success' });
            history.push('/');
          })
          .catch(err => {
            if (err.status === 503) {
              // TODO: snackbar
              // enqueueSnackbar('Network Error', { variant: 'error' });
            } else {
              console.log('errrrrrrrrrrrrrrrr', err);
              if (err.test) {
                const arrayFromTestObject = Object.keys(err.test).map(key => err.test[key]);
                setOtherError(arrayFromTestObject);
              } else {
                setOtherError(err);
              }
              setShowModal(true);
            }
          });
      })
      .catch(err => {
        console.log('*****************************', err);
      });
  };

  /* -------------------------------------------------------------------------- */
  /*                                   effects                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    console.log('&&&&&&&&&&&&&&&', otherError);
    if (otherError.length) {
      setShowModal(true);
    }
  }, [otherError]);

  /* -------------------------------------------------------------------------- */
  /*                                 components                                 */
  /* -------------------------------------------------------------------------- */

  const RadioIcon = props => {
    if (Platform.OS === 'web') {
      if (props.selected) {
        return <IconReact icon={faCheckCircle} color={colors.brandPrimary} />;
      }
      return <IconReact icon={faTimesCircle} color={colors.brandDanger} />;
    } else {
      if (props.selected) {
        return <IconReactNative name="check-circle" size={25} color={colors.brandPrimary} />;
      }
      return <IconReactNative name="times-circle" size={25} color={colors.brandDanger} />;
    }
  };

  const SexRadioButtons = () => {
    return (
      <View style={styles.genderContainer}>
        <ListItem selected={sex === 'male'} onPress={() => setSex('male')}>
          <Left>
            <RadioIcon selected={sex === 'male'} />
          </Left>
          <Right>
            <Text>Male</Text>
          </Right>
        </ListItem>
        <ListItem selected={sex === 'female'} onPress={() => setSex('female')}>
          <Left>
            <RadioIcon selected={sex === 'female'} />
          </Left>
          <Right>
            <Text>Female</Text>
          </Right>
        </ListItem>
        {/* <ListItem selected={sex === 'other'} onPress={() => setSex('other')}>
          <Left>
            <RadioIcon selected={sex === 'other'} />
          </Left>
          <Right>
            <Text>Other</Text>
          </Right>
        </ListItem> */}
      </View>
    );
  };

  const SignupForm = () => {
    return (
      <Form style={styles.form}>
        <H3 style={styles.title}>step one</H3>
        <Text style={styles.secondaryText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </Text>

        {!UserLocation ? (
          <Button block onPress={() => history.push('/getUserLocation')} style={styles.locationBtn}>
            <Text>Choose your location on map</Text>
          </Button>
        ) : (
          <Button
            block
            onPress={() => history.push('/getUserLocation')}
            style={styles.locationBtn}
            danger>
            <Text>Change your location</Text>
          </Button>
        )}

        {UserLocation ? (
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>Address : {UserLocation.address}</Text>
          </View>
        ) : null}

        <Text style={styles.error}>{locationError}</Text>

        <H3 style={styles.title}>step two</H3>
        <Text style={styles.secondaryText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </Text>

        {!SignupInfo ? (
          <>
            {!wait ? (
              <>
                <GoogleLoginBtn handleOtherErrors={handleOtherErrors} handleWait={handleWait} />
                <FacebookLoginBtn handleOtherErrors={handleOtherErrors} handleWait={handleWait} />
              </>
            ) : (
              <Spinner />
            )}
          </>
        ) : null}

        {SignupInfo ? (
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfoText}>HELLO {SignupInfo.firstname}</Text>
            <Image
              style={styles.userInfoImg}
              source={{
                uri: SignupInfo.thumbnail,
              }}
            />
          </View>
        ) : null}

        <Text style={styles.error}>{signupInfoError}</Text>

        <H3 style={styles.title}>Gender</H3>
        <SexRadioButtons />
        <Text style={styles.error}>{genderError}</Text>

        <H3 style={styles.title}>Birth</H3>
        <Text style={styles.secondaryText}>click on date to change the value</Text>
        <DatePicker handleNewDate={handleNewDate} date={date} />

        <H3 style={styles.title}>Submit</H3>
        <Text style={styles.secondaryText}>Thank you for joining fans club</Text>
        <View>
          <Button success block style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnTxt}>Ok</Text>
          </Button>
        </View>
      </Form>
    );
  };

  /* --------------------------------- return --------------------------------- */
  return (
    <>
      {Media === 'lg' ? (
        <>
          <ImageBackground source={require('../assets/img/3.jpeg')} style={styles.imageBack} />
          <Grid style={styles.formLayoutParent}>
            <Col size={1} />
            <Col size={2} style={styles.formCol}>
              <View style={styles.viewCol}>
                <SignupForm />
              </View>
            </Col>
            <Col size={1} />
          </Grid>
        </>
      ) : (
        <>
          <ImageBackground source={require('../assets/img/3.jpeg')} style={styles.imageBack} />
          <Grid padder style={styles.formLayoutParent}>
            <Col size={2} style={styles.formCol}>
              <View style={styles.viewCol}>
                <ScrollView>
                  <SignupForm />
                </ScrollView>
              </View>
            </Col>
          </Grid>
        </>
      )}
      <MyModal showModal={showModal} setShowModal={handleShowModal} title="ERROR" type="error">
        {typeof otherError === 'string' ? (
          <Text>{otherError}</Text>
        ) : (
          otherError.map((err, i) => <Text key={i}>{err}</Text>)
        )}
      </MyModal>
    </>
  );
};
