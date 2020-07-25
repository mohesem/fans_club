import React, {useEffect, useCallback, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import {useDispatch} from 'react-redux';
import * as turf from '@turf/turf';
import axios from 'axios';
import {Line} from 'react-chartjs-2';
// import IconReactNative from 'react-native-vector-icons/FontAwesome';
import colors from '../../myTheme/colors';
import {useHistory} from '../../router';
// apir
import getMembersFromPoly from '../../api/getMembersFromPoly';
// actions
import {centerAction} from '../../redux/actions';
import {Button} from 'native-base';

import ShareBtns from '../shareBtns';

import {FontAwesomeIcon as IconReact} from '@fortawesome/react-fontawesome';
import {faShare, faChartPie, faInfo, faTimes} from '@fortawesome/free-solid-svg-icons';

mapboxgl.accessToken =
  'pk.eyJ1IjoibW9oZXNlbSIsImEiOiJjanR3amhqcWcxZm05NDVtcG03Nm44Ynk4In0.YUdlvT5fABnW8BReNMSuPg';

let map;
let mapContainer;
let searchMarker = null;
let clubMarker = null;
const geojson = {
  type: 'FeatureCollection',
  features: [],
};
let localDataRef = {};
let fsLength = 0;
let _totalLikes;

export default props => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [mainColor, setMainColor] = useState('');
  const [helperColors, setHelperColors] = useState({
    c0: undefined,
    c1: undefined,
    c2: undefined,
    c3: 'rgb(255, 255, 255)',
  });
  const [helperChartMales, setHelperChartMales] = useState(null);
  const [helperChartFemales, setHelperChartFemales] = useState(null);
  const [helperChartTotal, setHelperChartTotal] = useState(null);
  const [helperTotalLikes, setHelperTotalLikes] = useState(null);
  const [helper, setHelper] = useState({
    step0: null,
    step1: null,
    step2: null,
  });
  const [chartWidth, setChartWidth] = useState(0);
  const [openShareButtons, setOpenShareButtons] = useState(false);
  const [legends, setLegends] = useState(0);

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
      zIndex: 1,
    },
    fabs: {backgroundColor: '#ffffff00', boxShadow: 'none'},
    fabShare: {
      height: 29,
      width: 29,
      padding: 6,
      marginBottom: 6,
      borderRadius: 5,
      backgroundColor: '#ffffff',
      shadowColor: colors.brandDark,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
    },
    fabClose: {
      height: 29,
      width: 29,
      padding: 9,
      borderRadius: 5,
      backgroundColor: '#ffffff',
      shadowColor: colors.brandDark,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
    },
    fabLegends: {
      height: 29,
      width: 29,
      borderRadius: 5,
      marginBottom: 6,
      backgroundColor: '#ffffff',
      shadowColor: colors.brandDark,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
    },
  };

  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */
  const getColorCode = (firstColorStr, secondColorStr, cb) => {
    let value;
    if (firstColorStr === 'white') {
      switch (secondColorStr) {
        case 'red':
          value = {r: 183, g: 28, b: 28};
          break;
        case 'blue':
          value = {r: 13, g: 71, b: 161};
          break;
        case 'green':
          value = {r: 0, g: 128, b: 0};
          break;
        case 'yellow':
          value = {r: 255, g: 193, b: 7};
          break;
        default:
          break;
      }
    } else {
      switch (firstColorStr) {
        case 'red':
          value = {r: 183, g: 28, b: 28};
          break;
        case 'blue':
          value = {r: 13, g: 71, b: 161};
          break;
        case 'green':
          value = {r: 0, g: 128, b: 0};
          break;
        case 'yellow':
          value = {r: 255, g: 193, b: 7};
          break;
        default:
          value = {r: 183, g: 28, b: 28};
          break;
      }
    }

    return cb(value);
  };

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

  function handleLegendsVisibility() {
    if (legends === 0) {
      return setLegends(1);
    }
    return setLegends(0);
  }

  function handleShreButtons() {
    if (openShareButtons) {
      return setOpenShareButtons(false);
    }
    return setOpenShareButtons(true);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  callbacks                                 */
  /* -------------------------------------------------------------------------- */
  const getClubTotalLikes = useCallback(() => {
    if (props.clubId) {
      axios
        .get(
          `https://www.fansclub.app/api/v1/GET/getClubTotalLikes/${props.likeOrDislike}/${props.clubId}`,
        )
        .then(response => {
          console.log('rerserserserserserserasedrasedrasdfasdfaserase');
          const firstColorStr = response.data.team.primary_color;
          const secondColorStr = response.data.team.secondary_color;
          calCulateColors(firstColorStr, secondColorStr, (c0, c1, c2) => {
            const colors = {c0, c1, c2};
            const {males} = response.data;
            const {females} = response.data;
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
            const numbers = {
              totalLikes: Math.round(total),
              step0,
              step1,
              step2,
            };
            _totalLikes = Math.round(total);
            setHelperColors(colors);
            setHelperChartFemales(chartFemales);
            setHelperChartMales(chartMales);
            setHelperChartTotal(chartTotal);
            setHelper({
              ...numbers,
            });
          });
        })
        .catch(error => {
          // NOTE: as there may be lots of requests for tiles it seems that best option is poping errors on console
          console.log(error);
        });
    }
  }, [calCulateColors, props.clubId, props.likeOrDislike]);

  const addToSourceOnData = useCallback(() => {
    if (map.getSource('boundary-source')) {
      const fs = map.queryRenderedFeatures({layers: ['boundry']});
      const {length} = fs;
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
        });
        if (reducedDuplicates.length) {
          axios
            .post('https://www.fansclub.app/api/v1/POST/getLikesForPolys', {
              likeOrDislike: props.likeOrDislike,
              teamId: props.clubId,
              reducedDuplicates,
            })
            .then(response => {
              // console.log({ response });
              const {likes} = response.data;
              Object.keys(likes).forEach(key => {
                map.setFeatureState(
                  {
                    source: 'boundary-source',
                    sourceLayer: 'boundry',
                    id: key,
                  },
                  {fans: likes[key]},
                );
              });
            })
            .catch(error => {
              // TODO: check this out
            });
        }
      }
    }
  }, [props.clubId, props.likeOrDislike]);

  const addFollowersPins = useCallback(() => {
    if (map.getZoom() > 8) {
      console.log('zoooooom is more than 8');
      const bbox = map.getBounds();
      getMembersFromPoly(bbox, props.likeOrDislike, props.clubId)
        .then(res => {
          geojson.features = [];
          res.data.likes.forEach(like => {
            console.log('?????????', like);
            if (Number(like.fid) < 500) {
              const newLike = {
                type: 'Point',
                geometry: like.geo,
                // properties: { icon-image: 'love' },
              };
              geojson.features.push(newLike);
            }
          });

          if (props.likeOrDislike === 'like') {
            map.getSource('likes').setData(geojson);
          } else {
            map.getSource('dislikes').setData(geojson);
          }
        })
        .catch(err => {
          console.log(err);
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
  }, [props.clubId, props.likeOrDislike]);

  const setChartWidthFunc = useCallback(() => {
    console.log('*&&&**%&#*&#^$*&#^%$*&^');
    if (window.innerWidth >= 360 && chartWidth < 300) {
      setChartWidth(300);
    }
    if (window.innerWidth < 360) {
      setChartWidth(window.innerWidth - 60);
    }
  }, [chartWidth]);
  /* -------------------------------------------------------------------------- */
  /*                                   effects                                  */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ initiate map ------------------------------ */
  useEffect(() => {
    const handleUpdateCenter = () => {
      const center = map.getCenter();
      dispatch(centerAction({lng: center.lng, lat: center.lat}));
    };

    map = new mapboxgl.Map({
      container: mapContainer,
      //   center: userReducer.location || [0, 0],
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
      'bottom-right',
    );
    map.setStyle('mapbox://styles/mohesem/ck59dnl2k1ij41co38c3zy6ib');
    handleUpdateCenter();
    map.on('moveend', handleUpdateCenter);
  }, [dispatch]);

  useEffect(() => {
    setChartWidthFunc();
  }, [setChartWidthFunc]);

  useEffect(() => {
    getClubTotalLikes();
  }, [getClubTotalLikes, props.clubId]);

  /* ---------------- fly to location on mapbox location search --------------- */
  useEffect(() => {
    if (searchMarker !== null) {
      searchMarker.remove();
    }
    if (props.flyTo?.length === 2) {
      map.flyTo({
        center: props.flyTo,
        zoom: 5,
        essential: true,
      });
      searchMarker = new mapboxgl.Marker({
        draggable: false,
      });
      searchMarker.setLngLat(props.flyTo);
      searchMarker.addTo(map);
    } else if (props.flyTo?.length === 4) {
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
    }
  }, [props, props.flyTo]);

  /* ------------------------------- fly to club ------------------------------ */
  useEffect(() => {
    // console.log('-----------_____________----------------', props.flyToClub.length);
    if (props.flyToClub?.length) {
      map.flyTo({
        center: props.flyToClub,
        zoom: 5,
        essential: true,
      });
    }
  }, [props.flyToClub]);

  /* ------------------------------ add club logo ----------------------------- */
  useEffect(() => {
    if (clubMarker !== null) {
      clubMarker.remove();
    }
    if (props.clubDetail.logoBase64) {
      const el = document.createElement('div');
      el.style.background = `url(data:image/png;base64,${props.clubDetail.logoBase64})`;
      el.style['background-position'] = 'center';
      el.style['background-size'] = 'contain';
      el.style.height = '60px';
      el.style.width = '60px';
      el.style['background-repeat'] = 'no-repeat';
      clubMarker = new mapboxgl.Marker(el);
      clubMarker.setLngLat(props.clubDetail.cityCoords);
      clubMarker.addTo(map);
    }
  }, [props.clubDetail.cityCoords, props.clubDetail.logoBase64]);

  /* -------------------------- add and remove layers ------------------------- */
  useEffect(() => {
    console.log('club id is ::::', props.clubId);
    localDataRef = {};
    if (props.clubId && !map.getSource('boundary-source')) {
      (function loop() {
        if (map.isStyleLoaded()) {
          /* -------------------------- virtualizaion layers -------------------------- */
          map.addSource('boundary-source', {
            type: 'vector',
            tiles: ['https://www.fansclub.app/api/v1/GET/tiles/{z}/{x}/{y}'],
            minzoom: 0,
            maxzoom: 14,
          });
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
          /* ------------------------- like and dislike points ------------------------ */
          const likesLayer = {
            id: 'likes',
            type: 'circle',
            source: 'likes',
            paint: {
              'circle-radius': 6,
              'circle-color': '#B42222',
            },
            // layout: {
            //   'icon-image': 'love-1',
            //   'icon-size': 0.5,
            // },
          };
          map.addSource('likes', {
            type: 'geojson',
            data: geojson,
          });
          map.addLayer(likesLayer, 'waterway-label');
          const dislikesLayer = {
            id: 'dislikes',
            type: 'circle',
            source: 'dislikes',
            paint: {
              'circle-radius': 6,
              'circle-color': '#B42222',
            },
            // layout: {
            //   'icon-image': 'love-1',
            //   'icon-size': 0.5,
            // },
          };
          map.addSource('dislikes', {
            type: 'geojson',
            data: geojson,
          });
          map.addLayer(dislikesLayer, 'waterway-label');
        } else {
          setTimeout(() => {
            loop();
          }, 50);
        }
      })();
    } else {
      // TODO: remove layers
    }
  }, [props.clubId]);

  /* ----------------------------- set layer color ---------------------------- */
  useEffect(() => {
    // const zoom = map.getZoom();
    (function loop() {
      if (props.clubId && map.isStyleLoaded() && mainColor && map.getSource('boundary-source')) {
        console.log('mainColor $$$$$$$$$$$$$$$$$$$$$', {mainColor});
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
  }, [mainColor, props.clubId]);

  useEffect(() => {
    function clear() {
      map.off('data', addToSourceOnData);
      map.off('moveend', addFollowersPins);
      window.removeEventListener('resize', setChartWidthFunc);
    }

    map.on('data', addToSourceOnData);
    // map.on('moveend', addToSourceOnMove);
    map.on('moveend', addFollowersPins);
    window.addEventListener('resize', setChartWidthFunc);
    return () => clear();
  }, [addFollowersPins, addToSourceOnData, props.clubId, setChartWidthFunc]);

  useEffect(() => {
    console.log('???????????????????????????????/');
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
    if (map.getZoom() > 8) {
      addFollowersPins();
    }
    fsLength = 0;
    localDataRef = {};
  }, [props.likeOrDislike]);

  /* -------------------------------------------------------------------------- */
  /*                                 components                                 */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <div
        ref={function ref(el) {
          mapContainer = el;
        }}
        style={styles.mapContainer}
      />
      {props.clubId ? (
        <div style={{zIndex: 1000}}>
          <div id="state-legend" className="legend" hidden={legends === 0}>
            <h4>Population</h4>
            <div>
              <span style={{backgroundColor: helperColors.c0}} />
              {helper.step0}
            </div>
            <div>
              <span style={{backgroundColor: helperColors.c1}} />
              {helper.step1}
            </div>
            <div>
              <span style={{backgroundColor: helperColors.c2}} />
              {helper.step2}
            </div>
            <div>
              <span style={{backgroundColor: helperColors.c3}} />0
            </div>
          </div>
          <div
            id="state-legend"
            className="legend legend-chart"
            style={{width: chartWidth}}
            hidden={legends === 1}>
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
                      data: helperChartTotal,
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
                      data: helperChartMales,
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
                      data: helperChartFemales,
                    },
                  ],
                }}
              />
            </div>
          </div>
          <div
            id="stop-virtualization"
            style={styles.fabs}
            className="legend-stop-virtualization"
            onPress={() => history.push('/')}>
            <Button style={styles.fabShare} onPress={handleShreButtons}>
              <IconReact icon={faShare} size="lg" color="#333333" />
            </Button>

            <Button
              light
              style={{...styles.fabLegends, padding: legends === 0 ? 6 : 11}}
              onPress={handleLegendsVisibility}>
              {legends === 0 ? (
                <IconReact icon={faChartPie} size="lg" color="#333333" />
              ) : (
                <IconReact icon={faInfo} size="lg" color="#333333" />
              )}
            </Button>
            <Button style={styles.fabClose} onPress={() => history.push('/')}>
              <IconReact icon={faTimes} size="lg" color="#333333" />
            </Button>
          </div>

          {openShareButtons ? <ShareBtns url={window.location.href} c="content" /> : null}
        </div>
      ) : null}
    </>
  );
};
