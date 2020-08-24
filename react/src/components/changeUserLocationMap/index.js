import React, {
  createRef,
  useEffect,
  useCallback,
  useState,
  useRef,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, TouchableOpacity, Keyboard} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import * as turf from '@turf/turf';
import {useHistory} from '../../router';

import {Text, View, Button} from 'native-base';

// api
import getAddress from '../../api/getUserAddress';

// actions
import {centerAction, userLocationAction} from '../../redux/actions';
import colors from '../../native-base-theme/colors';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoibW9oZXNlbSIsImEiOiJjanR3amhqcWcxZm05NDVtcG03Nm44Ynk4In0.YUdlvT5fABnW8BReNMSuPg',
);

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  map: {
    flex: 1,
  },
  popupContainer: {
    margin: 10,
    backgroundColor: colors.brandLight,
    padding: 10,
    zIndex: 200,
  },
  annotationContainer: {
    backgroundColor: 'white',
  },
  btn: {
    margin: 5,
    marginTop: 20,
    backgroundColor: colors.brandPrimary,
    width: 250,
    alignSelf: 'center',
    textAlign: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  btnTxt: {
    flexGrow: 1,
    textAlign: 'center',
    fontFamily: 'inherit',
    zIndex: 500,
  },
  txt: {},
  bubbleContainer: {
    borderRadius: 30,
    position: 'absolute',
    bottom: 16,
    left: 10,
    right: 10,
    paddingVertical: 16,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffffbd',
  },
});

export default props => {
  const dispatch = useDispatch();
  const history = useHistory();
  const UserLocation = useSelector(global => global.userLocation);

  /* -------------------------------------------------------------------------- */
  /*                                   states                                   */
  /* -------------------------------------------------------------------------- */
  const [searchMarkerCoords, setSearchMarkerCoords] = useState([]);
  const [bounds, setBounds] = useState({});
  const [cameraCenterCoords, setCameraCenterCoords] = useState([0, 0]);
  const [keyboardIsOpen, setKeyboardIsOpen] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                    refs                                    */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */
  const handleRegionChange = e => {
    const newCenter = {
      lng: e.geometry.coordinates[0],
      lat: e.geometry.coordinates[1],
    };
    dispatch(centerAction(newCenter));
  };

  // annotationRef.current.refresh();

  const handleUserLocation = e => {
    console.log('----------****------', e.geometry.coordinates);
    setSearchMarkerCoords(e.geometry.coordinates);

    if (UserLocation) {
      dispatch(userLocationAction(null));
    }

    const newCenter = {
      lng: e.geometry.coordinates[0],
      lat: e.geometry.coordinates[1],
    };

    getAddress(newCenter)
      .then(res => {
        dispatch(
          userLocationAction({
            location: newCenter,
            address: res.data.features[0].place_name,
          }),
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  /* -------------------------------------------------------------------------- */
  /*                                   effects                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const handlerOpen = () => {
      setKeyboardIsOpen(true);
    };
    Keyboard.addListener('keyboardDidShow', handlerOpen);
    return () => Keyboard.removeListener('keyboardDidShow', handlerOpen);
  });

  useEffect(() => {
    const handlerClose = () => {
      setKeyboardIsOpen(false);
    };
    Keyboard.addListener('keyboardDidHide', handlerClose);
    return () => Keyboard.removeListener('keyboardDidHide', handlerClose);
  });

  useEffect(() => {
    if (props.flyTo.length === 2) {
      setCameraCenterCoords(props.flyTo);

      console.log('+++++++++++++++++++', {ffffffff: props.flyTo});

      getAddress({lng: props.flyTo[0], lat: props.flyTo[1]})
        .then(res => {
          dispatch(
            userLocationAction({
              location: props.flyTo,
              address: res.data.features[0].place_name,
            }),
          );
        })
        .catch(err => {
          console.log(err);
        });
    } else if (props.flyTo.length === 4) {
      const newBound = {
        ne: [props.flyTo[0], props.flyTo[1]],
        sw: [props.flyTo[2], props.flyTo[3]],
      };

      const poly = turf.bboxPolygon(props.flyTo);
      const centerOfPoly = turf.centroid(poly);

      console.log('+++++++++++++++++++', {
        ccccccccCC: centerOfPoly.geometry.coordinates,
      });

      getAddress({
        lng: centerOfPoly.geometry.coordinates[0],
        lat: centerOfPoly.geometry.coordinates[1],
      })
        .then(res => {
          dispatch(
            userLocationAction({
              location: centerOfPoly.geometry.coordinates,
              address: res.data.features[0].place_name,
            }),
          );
        })
        .catch(err => {
          console.log(err);
        });

      setSearchMarkerCoords(centerOfPoly.geometry.coordinates);
      setBounds(newBound);
    }
  }, [dispatch, props.flyTo]);

  /* -------------------------------------------------------------------------- */
  /*                                  component                                 */
  /* -------------------------------------------------------------------------- */

  const Bubble = props => {
    return <View style={styles.bubbleContainer}>{props.children}</View>;
  };

  return (
    <View style={styles.mapView}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL="mapbox://styles/mohesem/ck59dnl2k1ij41co38c3zy6ib"
        onRegionDidChange={handleRegionChange}
        onLongPress={handleUserLocation}>
        <MapboxGL.Camera
          centerCoordinate={cameraCenterCoords}
          bounds={Object.keys(bounds).length ? bounds : null}
          animationDuration={3000}
          maxZoomLevel={0}
        />

        {searchMarkerCoords.length ? (
          <MapboxGL.PointAnnotation coordinate={searchMarkerCoords} />
        ) : null}
        {/* <MapboxGL.PointAnnotation
        coordinate={cameraCenterCoords}
        anchor={{x: 0.5, y: 1}}
      /> */}
      </MapboxGL.MapView>
      {!keyboardIsOpen ? (
        <Bubble>
          {UserLocation ? (
            <Text style={styles.txt}>{UserLocation.address}</Text>
          ) : (
            <Text style={styles.txt}>add your location</Text>
          )}
          {UserLocation ? (
            <Button
              // small
              rounded
              style={styles.btn}
              onPress={() => history.push('/signup')}>
              <Text style={styles.btnTxt}>submit</Text>
            </Button>
          ) : null}
        </Bubble>
      ) : null}
    </View>
  );
};
