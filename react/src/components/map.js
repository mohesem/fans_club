/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import debug from 'debug';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link as RouterLink } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import * as turf from '@turf/turf';

// chartjs
import { Line } from 'react-chartjs-2';

// material-ui component
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import FormatListBulletedRoundedIcon from '@material-ui/icons/FormatListBulletedRounded';
import LinkRoundedIcon from '@material-ui/icons/LinkRounded';

// actions
import signupActions from '../actions/signup';
import mapActions from '../actions/map';
import clubAction from '../actions/club';

// API
import getAddressFromMapboxApi from '../api/getAddressFromMapbox';
import getMembersFromPoly from '../api/getMembersFromPoly';

// components
import GetUserlocationNav from './getUserLocation';

mapboxgl.accessToken =
  'pk.eyJ1IjoibW9oZXNlbSIsImEiOiJjanR3amhqcWcxZm05NDVtcG03Nm44Ynk4In0.YUdlvT5fABnW8BReNMSuPg';
mapboxgl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js'
);

// --debug
const log = debug('log:Map');

const RedirectTo = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

let mapContainer;
let map;
const geojson = {
  type: 'FeatureCollection',
  features: [],
};
let _totalLikes;
const localDataRef = {};
let fsLength = 0;
let searchMarker = null;
let clubMarker = null;
let userLocationMarker = null;
const coordsArray = [];

function Map(props) {
  const dispatch = useDispatch();

  const userReducer = useSelector(state => state.user);
  const mapReducer = useSelector(state => state.map);
  const clubReducer = useSelector(state => state.club);

  // local state
  const [state, setState] = useState({
    submitLocationOnHold: false,
    isLoader: true,
    // NOTE: 0 is normal && 1 is getUserLocation && 2 is virtualization
    mode: 'wait',
    // NOTE: 1 is for like and 0 is for dislike
    likeOrDislike: 1,
    // NOTE: 0 is color helper and 1 is for chart
    legends: 0,
    clubId: undefined,
    center: undefined,

    chartWidth: 0,
    teamId: undefined,
  });

  const [helper, setHelper] = useState({
    chartTotal: undefined,
    chartMales: undefined,
    chartFemales: undefined,
    totalLikes: undefined,
    step0: undefined,
    step1: undefined,
    step2: undefined,
    c0: undefined,
    c1: undefined,
    c2: undefined,
    c3: 'rgb(255, 255, 255)',
  });

  // NOTE: as its for showcase we only suport likes
  const [isLike, setIsLike] = useState(true);

  function specifyCriterion() {
    // mapbox.setPaintProperty('boundry', 'fill-color', [
    //   'interpolate',
    //   ['exponential', 0.5],
    //   ['zoom'],
    //   15,
    //   '#e2714b',
    //   22,
    //   '#eee695'
    //   ]);

    const zoom = map.getZoom();
    (function loop() {
      if (_totalLikes) {
        if (zoom < 4) {
          map.setPaintProperty('boundry', 'fill-color', [
            'case',
            ['!=', ['feature-state', 'fans'], null],
            [
              'interpolate',
              ['linear'],
              ['feature-state', 'fans'],
              0,
              'rgb(236, 225, 203)',
              _totalLikes / 200,
              'rgba(211,47,47,1.0)',
            ],
            'rgba(255,255,255,1.0)',
          ]);
          return true;
        }
        if (zoom < 7) {
          map.setPaintProperty('boundry', 'fill-color', [
            'case',
            ['!=', ['feature-state', 'fans'], null],
            [
              'interpolate',
              ['linear'],
              ['feature-state', 'fans'],
              0,
              'rgb(236, 225, 203)',
              _totalLikes / 2000,
              'rgba(211,47,47,1.0)',
            ],
            'rgba(255,255,255,1.0)',
          ]);

          return true;
        }
        map.setPaintProperty('boundry', 'fill-color', [
          'case',
          ['!=', ['feature-state', 'fans'], null],
          [
            'interpolate',
            ['linear'],
            ['feature-state', 'fans'],
            0,
            'rgb(236, 225, 203)',
            _totalLikes / 20000,
            'rgba(211,47,47,1.0)',
          ],
          'rgba(255,255,255,1.0)',
        ]);
      } else {
        setTimeout(() => {
          loop();
        }, 50);
      }
    })();
  }

  function setChartWidthFunc() {
    if (window.innerWidth >= 360 && state.chartWidth < 300) {
      setState({ ...state, chartWidth: 300 });
    }
    if (window.innerWidth < 360) {
      setState({ ...state, chartWidth: window.innerWidth - 60 });
    }
  }

  window.addEventListener('resize', () => {
    setChartWidthFunc();
  });

  function getColorCode(firstColorStr, secondColorStr, cb) {
    let value;
    if (firstColorStr === 'white') {
      switch (secondColorStr) {
        case 'red':
          value = { r: 183, g: 28, b: 28 };
          break;
        default:
          break;
      }
    } else {
      switch (secondColorStr) {
        case 'red':
          value = { r: 183, g: 28, b: 28 };
          break;
        default:
          break;
      }
    }

    return cb({ r: 183, g: 28, b: 28 });
    // return cb(value);
  }

  function calCulauteColors(firstColorStr, secondColorStr, cb) {
    getColorCode(firstColorStr, secondColorStr, color => {
      const factorR = Math.round((255 - color.r) / 3);
      const factorG = Math.round((255 - color.g) / 3);
      const factorB = Math.round((255 - color.b) / 3);
      const color2 = {
        r: color.r + factorR,
        g: color.g + factorG,
        b: color.b + factorB,
      };
      const color3 = {
        r: color.r + factorR * 2,
        g: color.g + factorG * 2,
        b: color.b + factorB * 2,
      };
      const c0 = `rgb(${color.r}, ${color.g}, ${color.b})`;
      const c1 = `rgb(${color2.r}, ${color2.g}, ${color2.b})`;
      const c2 = `rgb(${color3.r}, ${color3.g},${color3.b})`;
      return cb(c0, c1, c2);
    });
  }

  if (mapReducer.flyTo.state === true) {
    console.log('flyyyyyyyyyyyyyyyyyyyyyyyy');
    if (mapReducer.flyTo.coord.length === 2) {
      if (searchMarker !== null) {
        searchMarker.remove();
      }

      map.flyTo({
        center: mapReducer.flyTo.coord,
        zoom: 5,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });
      searchMarker = new mapboxgl.Marker({
        draggable: false,
      });
      searchMarker.setLngLat(mapReducer.flyTo.coord);
      searchMarker.addTo(map);
      dispatch(mapActions.updateFlyTo({ state: false, coord: [] }));
    } else {
      if (searchMarker !== null) {
        searchMarker.remove();
      }
      // map.fitBounds([
      //   [32.958984, -5.353521],
      //   [43.50585, 5.615985],
      // ]);
      const c = mapReducer.flyTo.coord;
      map.fitBounds([
        [c[0], c[1]],
        [c[2], c[3]],
      ]);

      const poly = turf.bboxPolygon(c);
      const centerOfPoly = turf.centroid(poly);
      log('----------------------------------', centerOfPoly);
      searchMarker = new mapboxgl.Marker({
        draggable: false,
      });

      searchMarker.setLngLat(centerOfPoly.geometry.coordinates);
      searchMarker.addTo(map);
      dispatch(mapActions.updateFlyTo({ state: false, coord: [] }));
    }
  }

  if (mapReducer.flyToClub.state === true) {
    // log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%', clubMarker !== null, clubMarker);
    if (clubMarker !== null) {
      log('remove the fucking marker pleeeeeeeeeeeeeeeeeeeeeeeeease');
      clubMarker.remove();
    }

    if (clubReducer.cityCoords) {
      map.flyTo({
        center: clubReducer.cityCoords,
        zoom: 5,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });
    }

    if (clubReducer.logoBase64) {
      const el = document.createElement('div');
      el.style.background = `url(data:image/png;base64,${clubReducer.logoBase64})`;
      el.style['background-position'] = 'center';
      el.style['background-size'] = 'contain';
      el.style.height = `60px`;
      el.style.width = `60px`;
      el.style['background-repeat'] = 'no-repeat';
      clubMarker = new mapboxgl.Marker(el);
      clubMarker.setLngLat(clubReducer.cityCoords);
      clubMarker.addTo(map);
    }

    // if (!clubReducer.logoBase64) {
    //   if (clubMarker) {
    //     clubMarker.remove();
    //   }
    // }
    setTimeout(() => {
      dispatch(mapActions.updateFlyToClub({ state: false, coord: [] }));
    }, 10);

    // if (clubReducer.logoBase64) {
    //   const el = document.createElement('div');
    //   el.className = 'club-marker';
    //   // el.style.width = `${clubMarker.properties.iconSize[0]}px`;

    //   // const imageElem = document.createElement('img');
    //   // Just use the toString() method from your buffer instance
    //   // to get date as base64 type

    //   // imageElem.setAttribute('src', `data:image/jpg;base64,${clubReducer.logoBase64}`);

    //   // imageElem.src = `url:(data:image/jpeg;base64,${MMM.toString('base64')})`;

    //   // el.style.backgroundImage = `url(https://placekitten.com/g/${clubMarker.properties.iconSize.join(
    //   //   '/'
    //   // )}/)`;

    //   // const MMM =
    //   //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDUxRjY0ODgyQTkxMTFFMjk0RkU5NjI5MEVDQTI2QzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDUxRjY0ODkyQTkxMTFFMjk0RkU5NjI5MEVDQTI2QzUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENTFGNjQ4NjJBOTExMUUyOTRGRTk2MjkwRUNBMjZDNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENTFGNjQ4NzJBOTExMUUyOTRGRTk2MjkwRUNBMjZDNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuT868wAAABESURBVHja7M4xEQAwDAOxuPw5uwi6ZeigB/CntJ2lkmytznwZFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYW1qsrwABYuwNkimqm3gAAAABJRU5ErkJggg==';

    //   el.style.background = `url(data:image/png;base64,${clubReducer.logoBase64})`;
    //   el.style['background-position'] = 'center';
    //   el.style['background-size'] = 'contain';
    //   // log(`url:(data:image/jpg;base64,${clubReducer.logoBase64.toString('base64')})`);
    //   // el.style.height = `${clubMarker.properties.iconSize[1]}px`;
    //   el.style.height = `60px`;
    //   el.style.width = `60px`;
    //   //   , {
    //   //   draggable: false,
    //   // }
    //   clubMarker = new mapboxgl.Marker(el);
    //   clubMarker.setLngLat(clubReducer.cityCoords);
    //   clubMarker.addTo(map);

    //   log('$$$$$$$$$$$$$$$$$$$$$$', clubMarker);
    //   dispatch(mapActions.updateFlyToClub({ state: false, coord: [] }));

    //   // new mapboxgl.Marker(el).setLngLat(clubReducer.cityCoords).addTo(map);
    // } else {
    //   log(
    //     'elseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    //   );
    //   // clubMarker = new mapboxgl.Marker({
    //   //   draggable: false,
    //   // });
    //   // clubMarker.setLngLat(clubReducer.cityCoords);
    //   // clubMarker.addTo(map);
    //   // dispatch(mapActions.updateFlyToClub({ state: false, coord: [] }));
    // }
  }
  // NOTE: handeling routes
  const { location } = props;
  const { pathname } = location;
  function handleRoutes() {
    // log('route pathname', pathname);
    if (map) {
      const mode = (() => {
        if (pathname === '/signup/getUserLocation') return 1;
        if (pathname === '/') return 0;
        if (pathname.includes('/v/')) return 2;
        return 0;
      })();

      if (mode !== state.mode) {
        log('new state after route change');
        setState({ ...state, mode });
      }
    }

    // let mode;
    // switch (pathname) {
    //   case '/signup/getUserLocation':
    //     mode = 1;
    //     break;
    //   case '/':
    //     mode = 0;
    //     break;
    //   case pathname.includes('/'):
    //     mode = 2;
    //     break;
    //   default:
    //     mode = 0;
    //     break;
    // }
  }

  function getAddress(coords) {
    return new Promise((resolve, reject) => {
      /* TODO: use getLocation bar as a sub component and pass submit on hold to that */
      setState({ ...state, submitLocationOnHold: true });
      coordsArray.push(coords);

      getAddressFromMapboxApi(coords)
        .then(res => {
          log('mapbox res', res);
          resolve(res);
          setState({ ...state, submitLocationOnHold: false });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  function addUserLocationMarker(e) {
    dispatch(signupActions({ submitButtonState: false }));
    getAddress(e.lngLat.wrap())
      .then(address => {
        if (address) {
          log('final result is ==> ', {
            location: e.lngLat.wrap(),
            address: address.data.features[0].place_name,
          });
          dispatch(
            signupActions({
              location: e.lngLat.wrap(),
              address: address.data.features[0].place_name,
              submitButtonState: true,
            })
          );
        }
      })
      .catch(() => {
        log('some error came from mapbox');
      });

    if (userLocationMarker !== null) {
      userLocationMarker.remove();
    }
    userLocationMarker = new mapboxgl.Marker({
      draggable: false,
    });
    userLocationMarker.setLngLat(e.lngLat.wrap());
    userLocationMarker.addTo(map);
  }

  function handleLegendsVisibility() {
    if (state.legends === 0) return setState({ ...state, legends: 1 });
    return setState({ ...state, legends: 0 });
  }

  function addToSourceOnMove() {
    if (map.getSource('boundary-source')) {
      const pathnameSplit = pathname.split('/');
      const id = pathnameSplit[pathnameSplit.length - 1];
      const val = isLike === true ? 'like' : 'dislike';
      const bbox = map.getBounds();

      // log('bbox is ', bbox);
      if (map.getZoom() > 8) {
        getMembersFromPoly(bbox, val, id)
          .then(res => {
            geojson.features = [];

            // log('&&&&&&&&&&&&&&&&&&', res);
            res.data.likes.forEach(like => {
              if (Number(like.fid) < 500) {
                const newLike = {
                  type: 'Feature',
                  geometry: like.geo,
                };
                geojson.features.push(newLike);
              }
            });

            map.getSource('custom').setData(geojson);
          })
          .catch(err => {
            log(err);
          });
      }
      const fs = map.queryRenderedFeatures({ layers: ['boundry'] });
      const { length } = fs;
      if (fsLength !== length) {
        fsLength = length;
        const array = fs.map(f => f.id);
        const uniqueArray = [...new Set(array)];
        const reducedDuplicates = [];

        uniqueArray.forEach((u, i) => {
          if (!localDataRef[u]) {
            localDataRef[u] = 1;
            reducedDuplicates.push(u);
          }

          if (uniqueArray.length - 1 === i && reducedDuplicates.length) {
            axios
              .post('https://www.fansclub.app/api/v1/POST/getLikesForPolys', {
                teamId: state.teamId,
                reducedDuplicates,
              })
              .then(response => {
                const { likes } = response.data;
                Object.keys(likes).forEach(key => {
                  map.setFeatureState(
                    {
                      source: 'boundary-source',
                      sourceLayer: 'boundry',
                      id: key /* dataValues['USA1' + row.STATE_ID].id_int */,
                    },
                    { fans: likes[key] / 3 }
                  );
                });
              })
              .catch(error => {
                // TODO: check this out
              });
          }
        });
      }
    }

    return null;
  }

  function addToSourceOnData() {
    if (map.getSource('boundary-source')) {
      const bbox = map.getBounds();

      const fs = map.queryRenderedFeatures({ layers: ['boundry'] });
      const { length } = fs;
      if (fsLength !== length) {
        // log('bbox is addToSourceOnData', bbox);
        fsLength = length;
        const array = fs.map(f => f.id);
        const uniqueArray = [...new Set(array)];
        const reducedDuplicates = [];

        uniqueArray.forEach((u, i) => {
          if (!localDataRef[u]) {
            localDataRef[u] = 1;
            reducedDuplicates.push(u);
          }

          if (uniqueArray.length - 1 === i && reducedDuplicates.length) {
            axios
              .post('https://www.fansclub.app/api/v1/POST/getLikesForPolys', {
                teamId: state.teamId,
                reducedDuplicates,
              })
              .then(response => {
                const { likes } = response.data;
                Object.keys(likes).forEach(key => {
                  map.setFeatureState(
                    {
                      source: 'boundary-source',
                      sourceLayer: 'boundry',
                      id: key /* dataValues['USA1' + row.STATE_ID].id_int */,
                    },
                    { fans: likes[key] / 3 }
                  );
                });
              })
              .catch(error => {
                // TODO: check this out
              });
          }
        });
      }
    }

    return null;
  }

  function addOnData() {
    addToSourceOnData();
    specifyCriterion();
  }

  function addOnMove() {
    // const pathnameSplit = pathname.split('/');
    // const id = pathnameSplit[pathnameSplit.length - 1];
    // const val = isLike === true ? 'like' : 'dislike';
    // const bbox = map.getBounds();
    // callApi(bbox, val, id);
    addToSourceOnMove();
    specifyCriterion();

    map.off('data', addOnData);
  }

  function onClick(e) {
    getAddress(e.lngLat.wrap(), (err, address) => {
      if (address) {
        dispatch(signupActions.updateLocation(e.lngLat.wrap()));
        dispatch(signupActions.updateAddress(address.data.features[0].place_name));
      }
    });

    if (userLocationMarker !== null) {
      userLocationMarker.remove();
    }
    userLocationMarker = new mapboxgl.Marker({
      draggable: false,
    });
    userLocationMarker.setLngLat(e.lngLat.wrap());
    userLocationMarker.addTo(map);
  }

  useEffect(() => {
    if (map === undefined) {
      map = new mapboxgl.Map({
        container: mapContainer,
        center: userReducer.location || [0, 0],
        zoom: 2,
        attributionControl: false,
        maxZoom: 14,
      });
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        'bottom-right'
      );
      map.setStyle('mapbox://styles/mohesem/ck59dnl2k1ij41co38c3zy6ib');

      // map.on('style.load', () => {
      //   if (!map.isStyleLoaded()) {
      //     let count = 0;
      //     (function loop() {
      //       setTimeout(() => {
      //         count += 50;
      //         if (!map.isStyleLoaded()) return loop();
      //         return setState({ ...state, render: false, loaded: true });
      //       }, 0 + count);
      //     })();
      //   }
      // });

      // FIXME: delete on production
      window.mapbox = map;

      dispatch(mapActions.updateCenter(map.getCenter()));
      // setState({ ...state, isLoaded: true });
    }
  });

  function clearFansLocation() {
    if (
      map.getZoom() < 8 &&
      map.getSource('custom') &&
      map.getSource('custom')._data.features.length
    ) {
      map.getSource('custom').setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  }

  if (state.mode === 0) {
    map.off('click', addUserLocationMarker);
    if (userLocationMarker !== null) {
      userLocationMarker.remove();
    }
  }
  if (state.mode === 1) {
    map.on('click', addUserLocationMarker);
  }

  if (state.mode !== 'wait' && state.mode !== 2) {
    map.off('moveend', clearFansLocation);
  }
  if (state.mode === 2) {
    setChartWidthFunc();

    map.on('moveend', clearFansLocation);

    const pathnameSplit = pathname.split('/');
    // log('-------------------------------', <i className="fas fa-helicopter    " />);
    console.log(pathname.split('/'));
    if (
      pathnameSplit[pathnameSplit.length - 1] &&
      state.teamId !== pathnameSplit[pathnameSplit.length - 1]
    ) {
      console.log('get cluuuuuuuuuuuuuub');
      // alert(pathnameSplit[pathnameSplit.length - 1]);
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
        state.teamId,
        pathnameSplit[pathnameSplit.length - 1],
        pathnameSplit[pathnameSplit.length - 1] &&
          state.teamId !== pathnameSplit[pathnameSplit.length - 1]
      );

      _totalLikes = null;
      axios
        .get(`https://www.fansclub.app/api/v1/GET/club/${pathnameSplit[pathnameSplit.length - 1]}`)
        .then(res => {
          console.log('............................. club has been found', res);
          if (res.data.base64Image) {
            dispatch(
              mapActions.updateFlyToClub({
                state: true,
                coord: res.data.city.geo.coordinates,
              })
            );

            dispatch(
              clubAction({
                cityName: res.data.city.name,
                countyName: res.data.city.country,
                cityCoords: res.data.city.geo.coordinates,
                clubGroup: res.data.club.group,
                clubName: res.data.club.name,
                primaryColor: res.data.club.primary_color,
                secondaryColor: res.data.club.secondary_color,
                logoBase64: res.data.base64Image,
                teamId: res.data.club._id,
              })
            );
          } else {
            dispatch(
              mapActions.updateFlyToClub({
                state: true,
                coord: undefined,
              })
            );

            dispatch(
              clubAction({
                cityName: undefined,
                countyName: res.data.country,
                cityCoords: undefined,
                clubGroup: res.data.group,
                clubName: res.data.name,
                primaryColor: res.data.primary_color,
                secondaryColor: res.data.secondary_color,
                logoBase64: undefined,
                teamId: res.data._id,
              })
            );
          }
        })
        .catch(err => {
          console.log('errrrrrrrrrrrrrrrrrr', err);
        });

      axios
        .get(
          `https://www.fansclub.app/api/v1/GET/getClubTotalLikes/${
            pathnameSplit[pathnameSplit.length - 1]
          }`
        )
        .then(response => {
          const firstColorStr = response.data.team.primary_color;
          const secondColorStr = response.data.team.secondary_color;
          calCulauteColors(firstColorStr, secondColorStr, (c0, c1, c2) => {
            const colors = { c0, c1, c2 };
            const { males } = response.data;
            const { females } = response.data;
            const chartMales = [
              males[0] / 3,
              males[1] / 3,
              males[2] / 3,
              males[3] / 3,
              males[4] / 3,
              males[5] / 3,
            ];

            const chartFemales = [
              females[0] / 3 - ((females[0] / 3) * 20) / 100,
              females[1] / 3 - ((females[1] / 3) * 20) / 100,
              females[2] / 3 - ((females[2] / 3) * 20) / 100,
              females[3] / 3 - ((females[3] / 3) * 20) / 100,
              females[4] / 3 - ((females[4] / 3) * 20) / 100,
              females[5] / 3 - ((females[5] / 3) * 20) / 100,
            ];

            const chartTotal = [
              chartFemales[0] + chartMales[0],
              chartFemales[1] + chartMales[1],
              chartFemales[2] + chartMales[2],
              chartFemales[3] + chartMales[3],
              chartFemales[4] + chartMales[4],
              chartFemales[5] + chartMales[5],
            ];

            const sumMales = chartMales.reduce((a, b) => a + b, 0) / 3;
            const sumFemales = chartFemales.reduce((a, b) => a + b, 0) / 3;
            const total = sumMales + sumFemales;

            // NOTE: dividing total to stimated number of countries
            // TODO: finding a better logic for dividing
            const step0 = Math.round(total / 200);
            const stepCiterion = step0 / 3;
            const step1 = Math.round(step0 - stepCiterion);
            const step2 = Math.round(step1 - stepCiterion);
            const numbers = { totalLikes: Math.round(total), step0, step1, step2 };
            _totalLikes = Math.round(total);
            setHelper({ ...helper, ...numbers, ...colors, chartMales, chartFemales, chartTotal });
          });
        })
        .catch(error => {
          // NOTE: as there may be lots of requests for tiles it seems that best option is poping errors on console
          log(error);
        });

      setState({ ...state, teamId: pathnameSplit[pathnameSplit.length - 1] });
    }

    (function loop() {
      if (map && map.isStyleLoaded()) {
        if (!map.getSource('boundary-source')) {
          map.addSource('boundary-source', {
            type: 'vector',
            tiles: ['https://www.fansclub.app/api/v1/GET/tiles/{z}/{x}/{y}'],
            minzoom: 0,
            maxzoom: 18,
          });

          const boundry = {
            id: 'boundry',
            type: 'fill',
            source: 'boundary-source',
            'source-layer': 'boundry',
            paint: {
              'fill-color': 'rgb(255, 255, 255)',
              // [
              //   'case',
              //   ['!=', ['feature-state', 'fans'], null],
              //   [
              //     'interpolate',
              //     ['linear'],
              //     ['feature-state', 'fans'],
              //     0,
              //     'rgb(236, 225, 203)',
              //     10000000,
              //     'rgba(211,47,47,1.0)',
              //   ],
              //   'rgba(255,255,255,1.0)',
              // ],
            },
          };

          const boundry2 = {
            id: 'boundryLine',
            type: 'line',
            source: 'boundary-source',
            'source-layer': 'boundry',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#424242',
              'line-width': 2,
            },
          };

          map.addSource('custom', {
            type: 'geojson',
            data: geojson,
          });

          const likesLayer = {
            id: 'likes',
            type: 'circle',
            source: 'custom',
            paint: {
              'circle-radius': 6,
              'circle-color': '#B42222',
            },
          };

          // (async () => {
          map.addLayer(boundry, 'waterway-label');
          map.addLayer(boundry2, 'waterway-label');
          map.addLayer(likesLayer, 'waterway-label');
          map.on('data', addOnData);
          map.on('moveend', addOnMove);
          map.off('click', onClick);
          // })();
        }
      } else {
        setTimeout(() => {
          loop();
        }, 50);
      }
    })();
  }

  return (
    <>
      {handleRoutes()}
      <div
        ref={function ref(el) {
          mapContainer = el;
        }}
        className="mapContainer"
      />
      {/* {state.mode === 1 ? <GetUserlocationNav /> : null} */}
      {state.mode === 2 ? (
        <>
          <div id="state-legend" className="legend" hidden={state.legends === 0}>
            <h4>Population</h4>
            <div>
              <span style={{ backgroundColor: helper.c0 }} />
              {helper.step0}
            </div>
            <div>
              <span style={{ backgroundColor: helper.c1 }} />
              {helper.step1}
            </div>
            <div>
              <span style={{ backgroundColor: helper.c2 }} />
              {helper.step2}
            </div>
            <div>
              <span style={{ backgroundColor: helper.c3 }} />0
            </div>
          </div>
          <div
            id="state-legend"
            className="legend legend-chart"
            style={{ width: state.chartWidth }}
            hidden={state.legends === 1}
          >
            <h4>Population</h4>
            <div>
              <Line
                options={{
                  tooltips: {
                    displayColors: false,
                    // backgroundColor: 'black',
                    enabled: true,
                    mode: 'multiple',
                    bodyFontSize: 15,
                    bodyFontFamily: 'Gamja Flower',
                    bodyFontColor: 'white',
                    yPadding: 5,
                    xPadding: 5,
                    cornerRadius: 4,
                    bodyFontStyle: 'bold',
                    // callbacks: {
                    //   title: () => {
                    //     return '';
                    //   },
                    //   label: (tooltipItems, data) => {
                    //     return tooltipItems.yLabel;
                    //   },
                    // },
                  },
                  legend: {
                    display: true,
                  },
                  layout: {
                    padding: {
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                    },
                  },
                  scales: {
                    yAxes: [
                      {
                        // gridLines: {
                        //   drawBorder: true,
                        //   color: 'pink',
                        //   zeroLineColor: 'pink',
                        // },
                        ticks: {
                          // fontColor: 'green',
                          // fontFamily: 'Gamja Flower',
                          // fontSize: 10,
                          // fontStyle: 'bold',
                          // display: false,
                        },
                      },
                    ],
                    xAxes: [
                      {
                        // gridLines: {
                        //   drawBorder: true,
                        //   color: 'pink',
                        //   zeroLineColor: 'pink',
                        // },
                        ticks: {
                          // fontColor: 'blue',
                          // fontFamily: 'Gamja Flower',
                          // fontSize: 12,
                          // fontStyle: 'bold',
                          // dispaly: false,
                        },
                      },
                    ],
                  },
                  maintainAspectRatio: true,
                  animation: true,
                }}
                data={{
                  labels: ['0', '1', '2', '3', '4', '5', '6'],

                  datasets: [
                    {
                      label: 'total',
                      fill: false,
                      lineTension: 0.1,
                      backgroundColor: 'rgba(75,192,192,0.4)',
                      borderColor: '#2196f3',
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: 'rgba(75,192,192,1)',
                      pointBackgroundColor: '#fff',
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                      pointHoverBorderColor: 'rgba(220,220,220,1)',
                      pointHoverBorderWidth: 2,
                      pointRadius: 3,
                      pointHitRadius: 10,
                      data: helper.chartTotal,
                    },
                    {
                      label: 'male',
                      fill: false,
                      lineTension: 0.1,
                      backgroundColor: 'rgba(75,192,192,0.4)',
                      borderColor: '#fb8c00',
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: 'rgba(75,192,192,1)',
                      pointBackgroundColor: '#fff',
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                      pointHoverBorderColor: 'rgba(220,220,220,1)',
                      pointHoverBorderWidth: 2,
                      pointRadius: 3,
                      pointHitRadius: 10,
                      data: helper.chartMales,
                    },
                    {
                      label: 'female',
                      fill: false,
                      lineTension: 0.1,
                      backgroundColor: 'rgba(75,192,192,0.4)',
                      borderColor: '#673ab7',
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: 'rgba(75,192,192,1)',
                      pointBackgroundColor: '#fff',
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                      pointHoverBorderColor: 'rgba(220,220,220,1)',
                      pointHoverBorderWidth: 2,
                      pointRadius: 3,
                      pointHitRadius: 10,
                      data: helper.chartFemales,
                    },
                  ],
                }}
              />
            </div>
          </div>
          <div id="stop-virtualization" className="legend-stop-virtualization">
            <IconButton style={{ padding: 3, color: '#dd2c01' }}>
              <Link
                variant="body2"
                component={RedirectTo}
                to="/"
                style={{ height: '24px', width: '24px' }}
              >
                <CloseRoundedIcon />
              </Link>
            </IconButton>
          </div>

          <div id="show-chart" className="legend-show-chart">
            <IconButton style={{ padding: 3, color: '#263238' }}>
              <Link
                variant="body2"
                onClick={handleLegendsVisibility}
                style={{ height: '24px', width: '24px' }}
              >
                {state.legends === 0 ? (
                  <FormatListBulletedRoundedIcon />
                ) : (
                  <TrendingUpRoundedIcon />
                )}
              </Link>
            </IconButton>
          </div>

          <div id="link-legend" className="legend-Link">
            <IconButton
              style={{ padding: 3, color: '#263238' }}
              onClick={() => {
                (() => {
                  const el = document.createElement('textarea');
                  el.value = window.location.href;
                  document.body.appendChild(el);
                  el.select();
                  document.execCommand('copy');
                  document.body.removeChild(el);
                })();
              }}
            >
              <LinkRoundedIcon />
            </IconButton>
          </div>
        </>
      ) : null}
    </>
  );
}

export default withRouter(Map);
