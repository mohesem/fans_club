/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import debug from 'debug';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link as RouterLink } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import randomInt from 'random-int';

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
let userLocationMarker = null;
const coordsArray = [];

function Map(props) {
  const dispatch = useDispatch();

  const userReducer = useSelector(state => state.user);
  const mapReducer = useSelector(state => state.map);

  // local state
  const [state, setState] = useState({
    submitLocationOnHold: false,
    isLoader: true,
    // NOTE: 0 is normal && 1 is getUserLocation && 2 is virtualization
    mode: 0,
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
              _totalLikes / 600,
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
              _totalLikes / 5000,
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
            _totalLikes / 50000,
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
    // console.log(firstColorStr, secondColorStr);
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

    return cb(value);
  }

  function calCulauteColors(firstColorStr, secondColorStr, cb) {
    getColorCode(firstColorStr, secondColorStr, color => {
      // console.log(color);

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
    if (mapReducer.flyTo.coord.length === 2) {
      if (searchMarker !== null) {
        searchMarker.remove();
      }
      map.flyTo({
        center: mapReducer.flyTo.coord,
        zoom: 15,
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
      dispatch(mapActions.updateFlyTo({ state: false, coord: [] }));
    }
  }

  // NOTE: handeling routes
  const { location } = props;
  const { pathname } = location;
  function handleRoutes() {
    log('route pathname', pathname);
    const mode = (() => {
      if (pathname === '/signup/getUserLocation') return 1;
      if (pathname === '/') return 0;
      if (pathname.includes('/v/')) return 2;
      return 0;
    })();

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

    if (mode !== state.mode) {
      log('new state after route change');
      setState({ ...state, mode });
    }
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
    console.log('clickeeeeeed');
    if (state.legends === 0) return setState({ ...state, legends: 1 });
    return setState({ ...state, legends: 0 });
  }

  function addToSourceOnMove() {
    if (map.getSource('boundary-source')) {
      const pathnameSplit = pathname.split('/');
      const id = pathnameSplit[2];
      const val = isLike === true ? 'like' : 'dislike';
      const bbox = map.getBounds();

      log('bbox is ', bbox);
      if (map.getZoom() > 8) {
        console.log('current zool level is ', map.getZoom());
        getMembersFromPoly(bbox, val, id)
          .then(res => {
            geojson.features = [];

            log('&&&&&&&&&&&&&&&&&&', res);
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
            console.log('sending request for getting likes ');
            axios
              .post('http://http://185.8.175.15//api/v1/POST/getLikesForPolys', {
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
                console.log('............................', error);
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
        log('bbox is addToSourceOnData', bbox);
        fsLength = length;
        const array = fs.map(f => f.id);
        const uniqueArray = [...new Set(array)];

        uniqueArray.forEach(u => {
          if (!localDataRef[u]) {
            localDataRef[u] = 1;
            map.setFeatureState(
              {
                source: 'boundary-source',
                sourceLayer: 'boundry',
                id: u /* dataValues['USA1' + row.STATE_ID].id_int */,
              },
              { fans: randomInt(1000) }
            );
          }
        });
        // uniqueArray.forEach((u, i) => {
        //   if (!localDataRef[u]) {
        //     localDataRef[u] = 1;
        //     reducedDuplicates.push(u);
        //   }
        // if (uniqueArray.length - 1 === i && reducedDuplicates.length) {
        //   console.log('sending request for getting likes ');
        //   axios
        //     .post('http://http://185.8.175.15//v1/POST/getLikesForPolys', {
        //       teamId: state.teamId,
        //       reducedDuplicates,
        //     })
        //     .then(response => {
        //       const { likes } = response.data;
        //       Object.keys(likes).forEach(key => {
        //         map.setFeatureState(
        //           {
        //             source: 'boundary-source',
        //             sourceLayer: 'boundry',
        //             id: key /* dataValues['USA1' + row.STATE_ID].id_int */,
        //           },
        //           { fans: likes[key] / 3 }
        //         );
        //       });
        //     })
        //     .catch(error => {
        //       // TODO: check this out
        //       console.log('............................', error);
        //     });
        // }
        // });
      }
    }

    return null;
  }

  function addOnData() {
    addToSourceOnData();
    specifyCriterion();
  }

  function addOnMove() {
    console.log('move finished right now');
    // const pathnameSplit = pathname.split('/');
    // const id = pathnameSplit[2];
    // const val = isLike === true ? 'like' : 'dislike';
    // const bbox = map.getBounds();
    // callApi(bbox, val, id);
    addToSourceOnMove();
    specifyCriterion();

    map.off('data', addOnData);
  }

  function onClick(e) {
    console.log(state);
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

      map.on('style.load', () => {
        if (!map.isStyleLoaded()) {
          let count = 0;
          (function loop() {
            setTimeout(() => {
              count += 50;
              if (!map.isStyleLoaded()) return loop();
              return setState({ ...state, render: false, loaded: true });
            }, 0 + count);
          })();
        }
      });

      // FIXME: delete on production
      window.mapbox = map;

      dispatch(mapActions.updateCenter(map.getCenter()));
      setState({ ...state, isLoaded: true });
    } else if (state.mode === 0) {
      map.off('click', addUserLocationMarker);
      if (userLocationMarker !== null) {
        userLocationMarker.remove();
      }
    } else if (state.mode === 1) {
      map.on('click', addUserLocationMarker);
    } else if (state.mode === 2) {
      setChartWidthFunc();

      const pathnameSplit = pathname.split('/');

      // log('-------------------------------', <i className="fas fa-helicopter    " />);

      if (pathnameSplit[2] && state.teamId !== pathnameSplit[2]) {
        _totalLikes = null;
        setState({ ...state, teamId: pathnameSplit[2] });

        axios
          .get(`http://http://185.8.175.15//api/v1/GET/getClubTotalLikes/${pathnameSplit[2]}`)
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
            console.log(error);
          });
      }

      (function loop() {
        if (map.isStyleLoaded()) {
          if (!map.getSource('boundary-source')) {
            map.addSource('boundary-source', {
              type: 'vector',
              tiles: ['http://http://185.8.175.15//api/v1/GET/tiles/{z}/{x}/{y}'],
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
  });

  return (
    <>
      {handleRoutes()}
      <div
        ref={function ref(el) {
          mapContainer = el;
        }}
        className="mapContainer"
      />
      {state.mode === 1 ? <GetUserlocationNav /> : null}
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
