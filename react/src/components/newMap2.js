/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import debug from 'debug';
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link as RouterLink } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import * as turf from '@turf/turf';

// chartjs
import { Line } from 'react-chartjs-2';

// material-ui component
import { makeStyles } from '@material-ui/core/styles';
import { Link, Popover, Typography, IconButton } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import FormatListBulletedRoundedIcon from '@material-ui/icons/FormatListBulletedRounded';
import ShareRoundedIcon from '@material-ui/icons/ShareRounded';
import RoomIcon from '@material-ui/icons/Room';
// actions
import signupActions from '../actions/signup';
import mapActions from '../actions/map';
import clubAction from '../actions/club';

// API
import getAddressFromMapboxApi from '../api/getAddressFromMapbox';
import getMembersFromPoly from '../api/getMembersFromPoly';

// components
import GetUserlocationNav from './getUserLocation';
import ShareButtons from './shareButtons';

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
let localDataRef = {};
let fsLength = 0;
let searchMarker = null;
let clubMarker = null;
let userLocationMarker = null;
const coordsArray = [];

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

function Map(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  // porops
  const { location } = props;
  const { pathname } = location;

  /* -------------------------------------------------------------------------- */
  /*                                   states                                   */
  /* -------------------------------------------------------------------------- */
  // NOTE: 0 is normal && 1 is getUserLocation && 2 is virtualization
  const [mode, setMode] = useState(false);
  const [chartWidth, setChartWidth] = useState(0);
  // NOTE: 0 is color helper and 1 is for chart
  const [legends, setLegends] = useState(0);
  const [submitLocationOnHold, setSubmitLocationOnHold] = useState(false);
  const [center, setCenter] = useState(undefined);
  const [teamId, setTeamId] = useState('');
  const [likeOrDislike, setLikeOrDislike] = useState('');
  const [openShareButtons, setOpenShareButtons] = useState(false);
  const [mainColor, setMainColor] = useState('');
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

  // const [localDataRef, setLocalDataRef] = useState({});
  /* -------------------------------------------------------------------------- */
  /*                                  reducers                                  */
  /* -------------------------------------------------------------------------- */
  const userReducer = useSelector(global => global.user);
  const mapReducer = useSelector(global => global.map);
  const clubReducer = useSelector(global => global.club);

  /* -------------------------------------------------------------------------- */
  /*                                  function                                  */
  /* -------------------------------------------------------------------------- */

  function getColorCode(firstColorStr, secondColorStr, cb) {
    let value;
    if (firstColorStr === 'white') {
      switch (secondColorStr) {
        case 'red':
          value = { r: 183, g: 28, b: 28 };
          break;
        case 'blue':
          value = { r: 13, g: 71, b: 161 };
          break;
        case 'green':
          value = { r: 0, g: 128, b: 0 };
          break;
        case 'yellow':
          value = { r: 255, g: 193, b: 7 };
          break;
        default:
          break;
      }
    } else {
      switch (firstColorStr) {
        case 'red':
          value = { r: 183, g: 28, b: 28 };
          break;
        case 'blue':
          value = { r: 13, g: 71, b: 161 };
          break;
        case 'green':
          value = { r: 0, g: 128, b: 0 };
          break;
        case 'yellow':
          value = { r: 255, g: 193, b: 7 };
          break;
        default:
          value = { r: 183, g: 28, b: 28 };
          break;
      }
    }

    return cb(value);
    // return cb(value);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  callbcks                                  */
  /* -------------------------------------------------------------------------- */

  // const specifyCriterion = useCallback(() => {
  //   (function loop() {
  //     // console.log('^^^^^^^^^^^^^', _totalLikes && map && map.isStyleLoaded());
  //     if (map && map.isStyleLoaded()) {
  //       console.log('_________________+_+_+_+_!@#@)(#*@)($&(#*$^&', { mainColor });
  //       // const zoom = map.getZoom();
  //       map.setPaintProperty('boundry', 'fill-color', [
  //         'case',
  //         ['!=', ['feature-state', 'fans'], null],
  //         [
  //           'interpolate',
  //           ['linear'],
  //           ['feature-state', 'fans'],
  //           0,
  //           'rgba(236, 225, 203, 1)',
  //           1,
  //           mainColor,
  //         ],
  //         'rgba(236, 225, 203, 1)',
  //       ]);
  //     } else {
  //       setTimeout(() => {
  //         loop();
  //       }, 50);
  //     }
  //   })();
  // }, [mainColor]);

  // function specifyCriterion() {
  //   (function loop() {
  //     // console.log('^^^^^^^^^^^^^', _totalLikes && map && map.isStyleLoaded());
  //     if (map && map.isStyleLoaded() && mainColor) {
  //       console.log('_________________+_+_+_+_!@#@)(#*@)($&(#*$^&', { mainColor });
  //       // const zoom = map.getZoom();
  //       map.setPaintProperty('boundry', 'fill-color', [
  //         'case',
  //         ['!=', ['feature-state', 'fans'], null],
  //         [
  //           'interpolate',
  //           ['linear'],
  //           ['feature-state', 'fans'],
  //           0,
  //           'rgba(236, 225, 203, 1)',
  //           1,
  //           mainColor,
  //         ],
  //         'rgba(236, 225, 203, 1)',
  //       ]);
  //     } else {
  //       setTimeout(() => {
  //         loop();
  //       }, 50);
  //     }
  //   })();
  // }

  const calCulateColors = useCallback((firstColorStr, secondColorStr, cb) => {
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
      setMainColor(c0);
      // mainColor = c0;
      return cb(c0, c1, c2);
    });
    console.log('---------------------------------------');
  }, []);

  const getClub = useCallback(() => {
    console.log('get club *****************************', { teamId });
    if (teamId) {
      axios
        .get(`https://www.fansclub.app/api/v1/GET/club/${teamId}`)
        .then(res => {
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
    }
  }, [teamId]);

  const getClubTotalLikes = useCallback(() => {
    axios
      .get(`https://www.fansclub.app/api/v1/GET/getClubTotalLikes/${mode}/${teamId}`)
      .then(response => {
        const firstColorStr = response.data.team.primary_color;
        const secondColorStr = response.data.team.secondary_color;
        calCulateColors(firstColorStr, secondColorStr, (c0, c1, c2) => {
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
  }, [teamId]);

  const addToSourceOnData = useCallback(() => {
    // if (map.getSource('boundary-source')) {
    //   const bbox = map.getBounds();

    //   const fs = map.queryRenderedFeatures({ layers: ['boundry'] });
    //   const { length } = fs;
    //   if (fsLength !== length) {
    //     // log('bbox is addToSourceOnData', bbox);
    //     fsLength = length;
    //     const array = fs.map(f => f.id);
    //     const uniqueArray = [...new Set(array)];
    //     const reducedDuplicates = [];

    //     uniqueArray.forEach((u, i) => {
    //       if (!localDataRef[u]) {
    //         localDataRef[u] = 1;
    //         reducedDuplicates.push(u);
    //       }
    //     });

    //     if (reducedDuplicates.length) {
    //       axios
    //         .post('https://www.fansclub.app/api/v1/POST/getLikesForPolys', {
    //           likeOrDislike,
    //           teamId,
    //           reducedDuplicates,
    //         })
    //         .then(response => {
    //           const { likes } = response.data;
    //           Object.keys(likes).forEach(key => {
    //             map.setFeatureState(
    //               {
    //                 source: 'boundary-source',
    //                 sourceLayer: 'boundry',
    //                 id: key /* dataValues['USA1' + row.STATE_ID].id_int */,
    //               },
    //               { fans: likes[key] }
    //             );
    //           });
    //         })
    //         .catch(error => {
    //           // TODO: check this out
    //         });
    //     }
    //   }
    // }

    if (map.getSource('boundary-source')) {
      // console.log('------____________------------------------------___', { teamId });
      // const pathnameSplit = pathname.split('/');
      // const id = pathnameSplit[pathnameSplit.length - 1];

      // const splitHref = window.location.href.split('/');
      // const val = splitHref[splitHref.length - 1];

      // TODO: store val and if it chenged clear the previous ones;
      // TODO: set different colors for likes and dislikes
      // TODO: change dots to pins

      // log('bbox is ', bbox);

      const fs = map.queryRenderedFeatures({ layers: ['boundry'] });

      const { length } = fs;
      if (fsLength !== length) {
        fsLength = length;
        const array = fs.map(f => f.id);
        const uniqueArray = [...new Set(array)];
        const reducedDuplicates = [];
        // console.log('----____----++++++', { uniqueArray });
        uniqueArray.forEach((u, i) => {
          if (!localDataRef[u]) {
            // console.log({ u });
            localDataRef[u] = 1;
            reducedDuplicates.push(u);
          }
        });
        if (reducedDuplicates.length) {
          axios
            .post('https://www.fansclub.app/api/v1/POST/getLikesForPolys', {
              likeOrDislike,
              teamId,
              reducedDuplicates,
            })
            .then(response => {
              // console.log({ response });
              const { likes } = response.data;
              Object.keys(likes).forEach(key => {
                map.setFeatureState(
                  {
                    source: 'boundary-source',
                    sourceLayer: 'boundry',
                    id: key /* dataValues['USA1' + row.STATE_ID].id_int */,
                  },
                  { fans: likes[key] }
                );
              });
            })
            .catch(error => {
              // TODO: check this out
            });
        }
      }
    }
  }, [likeOrDislike, teamId]);

  const addToSourceOnMove = useCallback(() => {
    if (map.getSource('boundary-source')) {
      // console.log('------____________------------------------------___', { teamId });
      const pathnameSplit = pathname.split('/');
      const id = pathnameSplit[pathnameSplit.length - 1];

      const splitHref = window.location.href.split('/');
      const val = splitHref[splitHref.length - 1];

      // TODO: store val and if it chenged clear the previous ones;
      // TODO: set different colors for likes and dislikes
      // TODO: change dots to pins

      // log('bbox is ', bbox);

      const fs = map.queryRenderedFeatures({ layers: ['boundry'] });

      const { length } = fs;
      if (fsLength !== length) {
        fsLength = length;
        const array = fs.map(f => f.id);
        const uniqueArray = [...new Set(array)];
        const reducedDuplicates = [];
        // console.log('----____----++++++', { uniqueArray });
        uniqueArray.forEach((u, i) => {
          if (!localDataRef[u]) {
            // console.log({ u });
            localDataRef[u] = 1;
            reducedDuplicates.push(u);
          }
        });
        if (reducedDuplicates.length) {
          axios
            .post('https://www.fansclub.app/api/v1/POST/getLikesForPolys', {
              likeOrDislike,
              teamId,
              reducedDuplicates,
            })
            .then(response => {
              // console.log({ response });
              const { likes } = response.data;
              Object.keys(likes).forEach(key => {
                map.setFeatureState(
                  {
                    source: 'boundary-source',
                    sourceLayer: 'boundry',
                    id: key /* dataValues['USA1' + row.STATE_ID].id_int */,
                  },
                  { fans: likes[key] }
                );
              });
            })
            .catch(error => {
              // TODO: check this out
            });
        }
      }
    }

    setTimeout(() => {
      map.off('data', addToSourceOnData);
    }, 5000);
    return null;
  }, [likeOrDislike, teamId, mode]);

  const removeFeatures = useCallback(() => {
    if (map && map.isStyleLoaded()) {
      map.removeFeatureState({
        source: 'boundary-source',
        sourceLayer: 'boundry',
      });
      map.getSource('likes').setData({
        type: 'FeatureCollection',
        features: [],
      });
      map.getSource('dislikes').setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  }, [mode, teamId, likeOrDislike]);

  const addFollowersPins = useCallback(() => {
    if (mode === 2 && map.getZoom() > 8) {
      const bbox = map.getBounds();
      getMembersFromPoly(bbox, likeOrDislike, teamId)
        .then(res => {
          geojson.features = [];
          res.data.likes.forEach(like => {
            if (Number(like.fid) < 500) {
              const newLike = {
                type: 'Feature',
                geometry: like.geo,
                // properties: { icon-image: 'love' },
              };
              geojson.features.push(newLike);
            }
          });

          if (likeOrDislike === 'like') {
            map.getSource('likes').setData(geojson);
          } else {
            map.getSource('dislikes').setData(geojson);
          }
        })
        .catch(err => {
          log(err);
        });
    } else if (map.getSource('likes') || map.getSource('dislikes')) {
      map.getSource('likes').setData({
        type: 'FeatureCollection',
        features: [],
      });
      map.getSource('dislikes').setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  }, [likeOrDislike, teamId, mode]);

  const addUserLocationMarker = useCallback(
    e => {
      const getAddress = coords => {
        return new Promise((resolve, reject) => {
          /* TODO: use getLocation bar as a sub component and pass submit on hold to that */
          setSubmitLocationOnHold(true);
          // setState({ ...state, submitLocationOnHold: true });
          coordsArray.push(coords);

          getAddressFromMapboxApi(coords)
            .then(res => {
              log('mapbox res', res);
              resolve(res);
              setSubmitLocationOnHold(false);

              // setState({ ...state, submitLocationOnHold: false });
            })
            .catch(err => {
              reject(err);
            });
        });
      };

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
    },
    [mode]
  );
  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */
  function handleLegendsVisibility() {
    if (legends === 0) return setLegends(1);
    return setLegends(0);
  }

  function handleShreButtons() {
    if (openShareButtons) return setOpenShareButtons(false);
    return setOpenShareButtons(true);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   effects                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (pathname === '/' && mode !== 0) setMode(0);
    if (pathname === '/signup/getUserLocation' && mode !== 1) setMode(1);
    if (pathname.includes('/v/') && mode !== 2) setMode(2);
  }, [pathname]);

  const setChartWidthFunc = useCallback(() => {
    console.log('*&&&**%&#*&#^$*&#^%$*&^');
    if (window.innerWidth >= 360 && chartWidth < 300) {
      setChartWidth(300);
    }
    if (window.innerWidth < 360) {
      setChartWidth(window.innerWidth - 60);
    }
  }, [chartWidth]);

  useEffect(() => {
    if (mode === 2) {
      const split = pathname.split('/');
      const _teamId = split[split.length - 1];
      const _likeOrDislike = split[split.length - 2];

      setTeamId(_teamId);
      setLikeOrDislike(_likeOrDislike);
    }
  }, [pathname, mode]);

  useEffect(() => {
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

    // FIXME: delete on production
    window.mapbox = map;

    dispatch(mapActions.updateCenter(map.getCenter()));
    // setState({ ...state, isLoaded: true });
    map.loadImage(
      `data:image/png;base64,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`,
      (error, image) => {
        if (error) console.log('err on adding new image ', error);
        map.addImage('love-1', image);
      }
    );
  }, []);

  useEffect(() => {
    if (mode === 2) {
      console.log(clubReducer);
      if (userLocationMarker) userLocationMarker.remove();

      setChartWidthFunc();

      getClub();
      getClubTotalLikes();
    }
  }, [mode, teamId]);

  useEffect(() => {
    if (clubReducer.cityCoords) {
      map.flyTo({
        center: clubReducer.cityCoords,
        zoom: 5,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });
    }
  }, [clubReducer]);

  // console.log('^^^ 6^^ ^^^', { mode, teamId, mainColor });

  useEffect(() => {
    function clear() {
      map.off('data', addToSourceOnData);
      // map.off('moveend', addToSourceOnMove);
      map.off('moveend', addFollowersPins);
      window.removeEventListener('resize', setChartWidthFunc);
    }

    if (mode === 1) {
      map.on('click', addUserLocationMarker);
      return () => map.off('click', addUserLocationMarker);
    }
    if (mode === 2) {
      map.on('data', addToSourceOnData);
      // map.on('moveend', addToSourceOnMove);
      map.on('moveend', addFollowersPins);
      window.addEventListener('resize', setChartWidthFunc);
      return () => clear();
    }
  }, [mode, teamId]);

  useEffect(() => {
    if (mode === 2 && !map.getSource('boundary-source')) {
      console.log('+++++++++++++============+++++++++++++++++++++');
      (function loop() {
        if (map && map.isStyleLoaded()) {
          // boundary source >>
          map.addSource('boundary-source', {
            type: 'vector',
            tiles: ['https://www.fansclub.app/api/v1/GET/tiles/{z}/{x}/{y}'],
            minzoom: 0,
            maxzoom: 14,
          });

          // <<
          // main boundary layer >>
          const boundry = {
            id: 'boundry',
            type: 'fill',
            source: 'boundary-source',
            'source-layer': 'boundry',
          };
          map.addLayer(boundry, 'waterway-label');
          map.setPaintProperty('boundry', 'fill-color', [
            'case',
            ['!=', ['feature-state', 'fans'], null],
            [
              'interpolate',
              ['linear'],
              ['feature-state', 'fans'],
              0,
              'rgba(236, 225, 203, 1)',
              1,
              'rgba(236, 225, 203, 1)',
            ],
            'rgba(236, 225, 203, 1)',
          ]);

          // <<
          // boundary border lines >>
          const boundaryLine = {
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
          map.addLayer(boundaryLine, 'waterway-label');
          // <<
          // likes Layer >>
          const likesLayer = {
            id: 'likes',
            type: 'symbol',
            source: 'likes',
            layout: {
              'icon-image': 'love-1',
              'icon-size': 0.5,
            },
          };
          map.addSource('likes', {
            type: 'geojson',
            data: geojson,
          });
          map.addLayer(likesLayer, 'waterway-label');
          // <<
          // dislike Layer
          const dislikesLayer = {
            id: 'dislikes',
            type: 'symbol',
            source: 'dislikes',
            layout: {
              'icon-image': 'love-1',
              'icon-size': 0.5,
            },
          };
          map.addSource('dislikes', {
            type: 'geojson',
            data: geojson,
          });
          map.addLayer(dislikesLayer, 'waterway-label');
          // <<

          console.log('layers are all loaded');
        } else {
          setTimeout(() => {
            loop();
          }, 50);
        }
      })();
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 2) {
      if (likeOrDislike === 'like') {
        removeFeatures(teamId, 'like');
        // specifyCriterion();
        fsLength = 0;
        localDataRef = {};
      } else if (likeOrDislike === 'dislike') {
        removeFeatures(teamId, 'dislike');
        // specifyCriterion();
        fsLength = 0;
        localDataRef = {};
      }
    }
  }, [mode, teamId, likeOrDislike]);
  // criterion
  useEffect(() => {
    // const zoom = map.getZoom();
    if (mode === 2) {
      (function loop() {
        if (map && map.isStyleLoaded() && mainColor) {
          console.log('000000000000000000000000000000000000000000000', { mainColor });
          map.setPaintProperty('boundry', 'fill-color', [
            'case',
            ['!=', ['feature-state', 'fans'], null],
            [
              'interpolate',
              ['linear'],
              ['feature-state', 'fans'],
              0,
              'rgba(236, 225, 203, 1)',
              1,
              mainColor,
            ],
            'rgba(236, 225, 203, 1)',
          ]);
        } else {
          setTimeout(() => {
            loop();
          }, 50);
        }
      })();
    }
  }, [mode, mainColor]);

  useEffect(() => {
    const deleteLayers = () => {
      if (map.getLayer('likes')) {
        map.removeLayer('likes');
        map.removeSource('likes');
      }
      if (map.getLayer('dislikes')) {
        map.removeLayer('dislikes');
        map.removeSource('dislikes');
      }
      if (map.getLayer('boundryLine')) map.removeLayer('boundryLine');
      if (map.getLayer('boundry')) map.removeLayer('boundry');
      if (map.getSource('boundary-source')) map.removeSource('boundary-source');
    };

    if (mode === 0) {
      deleteLayers();
      if (userLocationMarker) userLocationMarker.remove();
    }

    if (mode === 1) {
      deleteLayers();
    }
  }, [mode]);

  /* -------------------------------------------------------------------------- */
  /*                                 situational                                */
  /* -------------------------------------------------------------------------- */
  if (mapReducer.flyToClub.state === true) {
    // log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%', clubMarker !== null, clubMarker);
    if (clubMarker !== null) {
      log('remove the fucking marker pleeeeeeeeeeeeeeeeeeeeeeeeease');
      clubMarker.remove();
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

    setTimeout(() => {
      dispatch(mapActions.updateFlyToClub({ state: false, coord: [] }));
    }, 10);
  }

  if (mapReducer.flyTo.state === true) {
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

  /* -------------------------------------------------------------------------- */
  /*                                   return                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <>
      <div
        ref={function ref(el) {
          mapContainer = el;
        }}
        className="mapContainer"
      />
      {mode === 2 ? (
        <>
          <div id="state-legend" className="legend" hidden={legends === 0}>
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
            style={{ width: chartWidth }}
            hidden={legends === 1}
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
                        ticks: {},
                      },
                    ],
                    xAxes: [
                      {
                        ticks: {},
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
                {legends === 0 ? <FormatListBulletedRoundedIcon /> : <TrendingUpRoundedIcon />}
              </Link>
            </IconButton>
          </div>

          <div id="link-legend" className="legend-Link">
            <IconButton style={{ padding: 3, color: '#263238' }} onClick={handleShreButtons}>
              <ShareRoundedIcon />
            </IconButton>
          </div>
          {openShareButtons ? <ShareButtons url={window.location.href} c="content" /> : null}
        </>
      ) : null}
    </>
  );
}

export default withRouter(Map);
