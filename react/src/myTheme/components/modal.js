import React, {useState, useEffect} from 'react';
import {
  Platform,
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import colors from '../colors';
import theme from '../theme';

export default props => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(props.showModal);

    console.log('-----------------------------------', props.showModal);
  }, [props.showModal]);

  const handleClose = () => {
    props.setShowModal(false);
  };

  const styles = StyleSheet.create({
    wrapper: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      zIndex: 500,
      overflow: 'scroll',
      backgroundColor: '#00000066',
    },
    content: {
      backgroundColor: colors.brandLight,
      margin: Platform.OS === 'web' ? 'auto' : 20,
      borderRadius: 20,
      minWidth: 350,
      // flexDirection: 'column',
      alignSelf: 'center',
    },
    headerText: {
      fontWeight: 'bold',
      color: props.type ? colors[props.type] : colors.brandDark,
    },
    header: {
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomWidth: 1,
      borderBottomColor: props.type ? colors[props.type] : colors.bws4,
      backgroundColor: colors.brandLight,
    },
    body: {padding: 20},
    footer: {padding: 20},
    closeBtn: {
      backgroundColor: colors.brandDanger,
      padding: 10,
      alignSelf: Platform.OS === 'web' ? 'flex-start' : 'flex-end',
    },
    closeBtnTxt: {
      color: colors.brandLight,
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                     web                                    */
  /* -------------------------------------------------------------------------- */
  const ModalWeb = () => {
    return (
      <TouchableOpacity style={styles.wrapper} onPress={handleClose}>
        <TouchableWithoutFeedback>
          <View style={styles.content}>
            <View style={styles.header}>
              {props.title ? (
                <Text style={styles.headerText}>{props.title}</Text>
              ) : null}
            </View>
            <View style={styles.body}>{props.children}</View>
            <View style={styles.footer}>
              <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                <Text style={styles.closeBtnTxt}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    );
  };

  const render = () => {
    if (show) {
      return Platform.OS === 'web' ? <ModalWeb /> : <ModalWeb />;
    }
    return null;
  };

  return render();
};
