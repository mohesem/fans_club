/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, {createRef, useEffect, useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {StyleSheet} from 'react-native';
import {centerAction} from '../../redux/actions';
import * as turf from '@turf/turf';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoibW9oZXNlbSIsImEiOiJjanR3amhqcWcxZm05NDVtcG03Nm44Ynk4In0.YUdlvT5fABnW8BReNMSuPg',
);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: 'tomato',
  },
  map: {
    flex: 1,
  },
});

export default props => {
  const dispatch = useDispatch();

  /* -------------------------------------------------------------------------- */
  /*                                   states                                   */
  /* -------------------------------------------------------------------------- */
  const [searchMarkerCoords, setSearchMarkerCoords] = useState([]);
  const [bounds, setBounds] = useState({});
  const [cameraCenterCoords, setCameraCenterCoords] = useState([0, 0]);

  /* -------------------------------------------------------------------------- */
  /*                                  refrences                                 */
  /* -------------------------------------------------------------------------- */
  const _vectorSource = createRef();

  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */
  const handleRegionChange = e => {
    const newCenter = {
      lng: e.geometry.coordinates[0],
      lat: e.geometry.coordinates[1],
    };
    console.log('****************', newCenter);
    dispatch(centerAction(newCenter));
  };

  useEffect(() => {
    if (props.flyTo.length === 2) {
      setCameraCenterCoords(props.flyTo);
    } else if (props.flyTo.length === 4) {
      const newBound = {
        ne: [props.flyTo[0], props.flyTo[1]],
        sw: [props.flyTo[2], props.flyTo[3]],
      };

      const poly = turf.bboxPolygon(props.flyTo);
      const centerOfPoly = turf.centroid(poly);

      setSearchMarkerCoords(centerOfPoly.geometry.coordinates);
      setBounds(newBound);
    }
  }, [props.flyTo]);

  /* -------------------------------------------------------------------------- */
  /*                                   return                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <MapboxGL.MapView
      style={styles.map}
      styleURL="mapbox://styles/mohesem/ck59dnl2k1ij41co38c3zy6ib"
      onRegionDidChange={handleRegionChange}>
      <MapboxGL.Camera
        // zoomLevel={0}
        // centerCoordinate={[-122.447303, 37.753574]}
        centerCoordinate={cameraCenterCoords}
        bounds={Object.keys(bounds).length ? bounds : null}
        animationDuration={3000}
        maxZoomLevel={0}
      />
      <MapboxGL.VectorSource
        id="mapbox-terrain"
        maxZoomLevel={10}
        ref={_vectorSource}
        // url="mapbox://mapbox.mapbox-terrain-v2">
        tileUrlTemplates={[
          'https://www.fansclub.app/api/v1/GET/tiles/{z}/{x}/{y}',
        ]}>
        {/* <MapboxGL.LineLayer
          layerIndex={200}
          id="mapbox-mapbox-terrain"
          sourceLayerID="contour"
          // sourceID="xzcv"
          style={{
            lineColor: '#ff0000',
            lineJoin: 'round',
            lineCap: 'round',
            lineWidth: 1,
          }}
        /> */}

        <MapboxGL.LineLayer
          layerIndex={200}
          id="boundryLine"
          sourceLayerID="boundry"
          // sourceID="xzcv"
          // style={{
          //   fillColor: 'blue',
          // }}
          style={{
            lineColor: '#ff0000',
            lineJoin: 'round',
            lineCap: 'round',
            lineWidth: 1,
          }}
        />
      </MapboxGL.VectorSource>
      {searchMarkerCoords.length ? (
        <MapboxGL.PointAnnotation coordinate={searchMarkerCoords} />
      ) : null}
    </MapboxGL.MapView>
  );
};

{
}
