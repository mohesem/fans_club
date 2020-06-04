import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {ImageBackground, StyleSheet, ScrollView, Platform} from 'react-native';
import {Grid, Col, H3, View, Form, Text, Spinner} from 'native-base';
import MyModal from '../myTheme/components/modal';

import {GoogleLoginBtn, FacebookLoginBtn} from '../components/signinSocialBtns';

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
  },
  formLayoutParent: {
    position: 'absolute',
    top: 56,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: Platform.OS === 'web' ? 'auto' : null,
  },
  formCol: {
    // padding: 20,
  },
  viewCol: {
    backgroundColor: '#ecececf0',
    padding: 20,
    paddingBottom: 50,
    flexDirection: 'column',
    flexGrow: 1,
  },
  form: {
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    marginBottom: 10,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default () => {
  const mediaReducer = useSelector(global => global.media);
  const [otherError, setOtherError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [wait, setWait] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------- */
  /*                                 components                                 */
  /* -------------------------------------------------------------------------- */
  const SigninForm = () => {
    return (
      <Form style={styles.form}>
        <H3 style={styles.title}>step one</H3>
        {!wait ? (
          <>
            <GoogleLoginBtn
              handleOtherErrors={handleOtherErrors}
              handleWait={handleWait}
            />
            <FacebookLoginBtn
              handleOtherErrors={handleOtherErrors}
              handleWait={handleWait}
            />
          </>
        ) : (
          <Spinner />
        )}
      </Form>
    );
  };
  return (
    <>
      {mediaReducer === 'lg' ? (
        <>
          <ImageBackground
            source={require('../assets/img/3.jpeg')}
            style={styles.imageBack}
          />
          <Grid style={styles.formLayoutParent}>
            <Col size={1} />
            <Col size={2} style={styles.formCol}>
              <View style={styles.viewCol}>
                <SigninForm />
              </View>
            </Col>
            <Col size={1} />
          </Grid>
        </>
      ) : (
        <>
          <ImageBackground
            source={require('../assets/img/3.jpeg')}
            style={styles.imageBack}
          />
          <Grid padder style={styles.formLayoutParent}>
            <Col size={2} style={styles.formCol}>
              <View style={styles.viewCol}>
                <ScrollView>
                  <SigninForm />
                </ScrollView>
              </View>
            </Col>
          </Grid>
        </>
      )}
      <MyModal
        showModal={showModal}
        setShowModal={handleShowModal}
        title="ERROR"
        type="brandDanger">
        {typeof otherError === 'string' ? (
          <Text>{otherError}</Text>
        ) : (
          otherError.map((err, i) => <Text key={i}>{err}</Text>)
        )}
      </MyModal>
    </>
  );
};
