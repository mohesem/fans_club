import React, {useEffect, useCallback} from 'react';
import mapboxgl from 'mapbox-gl';
import {useDispatch, useSelector} from 'react-redux';
import * as turf from '@turf/turf';
import {Text, View, Button} from 'native-base';
import ReactDOM from 'react-dom';
import {useHistory} from '../../router';
// actions
import {centerAction, userLocationAction, userAction} from '../../redux/actions';

// api
import getAddress from '../../api/getUserAddress';

import colors from '../../native-base-theme/colors';

import changeLocationApi from '../../api/changeUserLocation';
import getUserInfoApi from '../../api/getUserInfo';

mapboxgl.accessToken =
  'pk.eyJ1IjoibW9oZXNlbSIsImEiOiJjanR3amhqcWcxZm05NDVtcG03Nm44Ynk4In0.YUdlvT5fABnW8BReNMSuPg';

let map;
let mapContainer;
let searchMarker = null;
let popup = null;

const placeholder = window.document.createElement('div');

export default props => {
  const dispatch = useDispatch();
  const history = useHistory();

  const UserLocation = useSelector(global => global.userLocation);
  const User = useSelector(global => global.user);

  /* -------------------------------------------------------------------------- */
  /*                                   styles                                   */
  /* -------------------------------------------------------------------------- */
  const styles = {
    mapContainer: {
      position: 'absolute',
      top: 56,
      right: 0,
      left: 0,
      bottom: 0,
    },

    btn: {
      margin: 5,
      marginTop: 20,
      backgroundColor: colors.brandPrimary,
    },
    btnTxt: {
      flexGrow: 1,
      textAlign: 'center',
      fontFamily: 'inherit',
    },
    txt: {},
    popupContainer: {
      margin: 10,
    },
  };

  const PopupContent = () => {
    return (
      <View style={styles.popupContainer}>
        {UserLocation ? (
          <Text style={styles.txt}>{UserLocation.address}</Text>
        ) : (
          <Text style={styles.txt}>...</Text>
        )}
        {UserLocation ? (
          <Button
            small
            style={styles.btn}
            onPress={() => {
              changeLocationApi({UserLocation, token: localStorage.getItem('fans-club')})
                .then(res => {
                  getUserInfoApi(localStorage.get('fans-club')).then(res => {
                    // console.log('------------------***--------------', res);
                    // dispatch(isUserAction(true));
                    const user = {
                      firstname: res.data.firstname,
                      lastname: res.data.lastname,
                      thumbnail: res.data.thumbnail,
                      location: res.data.location,
                      likes: res.data.likes,
                      dislikes: res.data.dislikes,
                      address: res.data.address,
                    };
                    // console.log('*****&&&', user);
                    dispatch(userAction(user));
                    history.push('/clubs');
                  });
                })
                .catch(() => {
                  // todo: show error message and redirect to profile page
                });
            }}>
            <Text style={styles.btnTxt}>submit</Text>
          </Button>
        ) : null}
      </View>
    );
  };

  ReactDOM.render(<PopupContent />, placeholder);

  // const PopupContent = <p>hello</p>;

  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                   effects                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainer,
      //   center: userReducer.location || [0, 0],
      zoom: 2,
      attributionControl: false,
      maxZoom: 14,
    });
    map.setStyle('mapbox://styles/mohesem/ck59dnl2k1ij41co38c3zy6ib');
  }, []);

  useEffect(() => {
    const handleUpdateCenter = () => {
      const center = map.getCenter();
      dispatch(centerAction({lng: center.lng, lat: center.lat}));
    };
    handleUpdateCenter();

    map.on('moveend', handleUpdateCenter);
  }, [dispatch]);

  useEffect(() => {
    const handleUserLocation = e => {
      console.log('clicked', UserLocation);

      if (UserLocation) {
        dispatch(userLocationAction(null));
      }

      if (popup) {
        popup.remove();
      }

      map.flyTo({
        center: e.lngLat.wrap(),
        // zoom: 5,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });

      popup = new mapboxgl.Popup().setLngLat(e.lngLat.wrap()).setDOMContent(placeholder);

      popup.addTo(map);

      console.log('*&^*&^*&&^*&^', e.lngLat.wrap());

      getAddress(e.lngLat.wrap())
        .then(res => {
          dispatch(
            userLocationAction({
              location: e.lngLat.wrap(),
              address: res.data.features[0].place_name,
            }),
          );
        })
        .catch(err => {
          console.log(err);
        });
    };

    map.on('click', handleUserLocation);
    return () => map.off('click', handleUserLocation);
  });

  useEffect(() => {
    if (props.flyTo.length === 2) {
      if (searchMarker !== null) {
        searchMarker.remove();
      }
      map.flyTo({
        center: props.flyTo,
        zoom: 5,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });
      searchMarker = new mapboxgl.Marker({
        draggable: false,
      });
      searchMarker.setLngLat(props.flyTo);
      searchMarker.addTo(map);
      // props.handleFlyTo([]);
    } else if (props.flyTo.length === 4) {
      if (searchMarker !== null) {
        searchMarker.remove();
      }
      const c = props.flyTo;
      map.fitBounds(
        [
          [c[0], c[1]],
          [c[2], c[3]],
        ],
        {padding: 50, animate: true, essential: true, duration: 3000},
      );

      const poly = turf.bboxPolygon(c);
      const centerOfPoly = turf.centroid(poly);
      searchMarker = new mapboxgl.Marker({
        draggable: false,
      });

      searchMarker.setLngLat(centerOfPoly.geometry.coordinates);
      searchMarker.addTo(map);
      // props.handleFlyTo([]);
    }
  }, [props, props.flyTo]);

  /* -------------------------------------------------------------------------- */
  /*                                 components                                 */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      ref={function ref(el) {
        mapContainer = el;
      }}
      style={styles.mapContainer}
    />
  );
};
