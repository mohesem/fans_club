/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
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
import { makeStyles } from '@material-ui/core/styles';
import { Link, Popover, Typography, IconButton } from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import FormatListBulletedRoundedIcon from '@material-ui/icons/FormatListBulletedRounded';
import LinkRoundedIcon from '@material-ui/icons/LinkRounded';
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
const localDataRef = {};
let fsLength = 0;
const searchMarker = null;
const clubMarker = null;
const userLocationMarker = null;
const coordsArray = [];

let TeamId = null;
let LikeOrDislike = null;

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

function Map(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const userReducer = useSelector(state => state.user);
  const mapReducer = useSelector(state => state.map);
  const clubReducer = useSelector(state => state.club);
  const searchModeReducer = useSelector(state => state.search);
  const [searchMode, setSearchMode] = useState('');
  const [openShareButtons, setOpenShareButtons] = useState(false);

  // local state
  const [state, setState] = useState({
    submitLocationOnHold: false,
    isLoader: true,
    // NOTE: 0 is normal && 1 is getUserLocation && 2 is virtualization
    mode: 'wait',
    // NOTE: 0 is color helper and 1 is for chart
    legends: 0,
    center: undefined,
    chartWidth: 0,
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

  const [anchorEl, setAnchorEl] = useState(null);

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
  }

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

  function handleLegendsVisibility() {
    if (state.legends === 0) return setState({ ...state, legends: 1 });
    return setState({ ...state, legends: 0 });
  }

  function handleShreButtons() {
    if (openShareButtons) return setOpenShareButtons(false);
    return setOpenShareButtons(true);
  }

  function setChartWidthFunc() {
    if (window.innerWidth >= 360 && state.chartWidth < 300) {
      setState({ ...state, chartWidth: 300 });
    }
    if (window.innerWidth < 360) {
      setState({ ...state, chartWidth: window.innerWidth - 60 });
    }
  }

  function getClub(teamId) {
    axios
      .get(`https://www.fansclub.app/api/v1/GET/club/${teamId}`)
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
  }

  function getClubTotalLikes(teamId, mode) {
    console.log('getClubTotalLikes ......', teamId, mode);
    axios
      .get(`https://www.fansclub.app/api/v1/GET/getClubTotalLikes/${mode}/${teamId}`)
      .then(response => {
        console.log('getClubTotalLikes response', response);
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
  }

  function addFollowersPins() {
    // console.log('&&&&&&&&&&----------&&&', LikeOrDislike, TeamId);
    if (map.getZoom() > 8) {
      const bbox = map.getBounds();
      getMembersFromPoly(bbox, LikeOrDislike, TeamId)
        .then(res => {
          geojson.features = [];

          console.log('&&&&&&&&&&&&&&&&&&', res);
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

          if (LikeOrDislike === 'like') {
            map.getSource('likes').setData(geojson);
          } else {
            map.getSource('dislikes').setData(geojson);
          }
        })
        .catch(err => {
          log(err);
        });
    } else {
      map.getSource('likes').setData({
        type: 'FeatureCollection',
        features: [],
      });
      map.getSource('dislikes').setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
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
                likeOrDislike: LikeOrDislike,
                teamId: TeamId,
                reducedDuplicates,
              })
              .then(response => {
                console.log(response);
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
        });
      }
    }

    return null;
  }

  function addToSourceOnMove() {
    if (map.getSource('boundary-source')) {
      const pathnameSplit = pathname.split('/');
      const id = pathnameSplit[pathnameSplit.length - 1];

      const splitHref = window.location.href.split('/');
      const val = splitHref[splitHref.length - 1];

      console.log('-----------------', val);

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

        uniqueArray.forEach((u, i) => {
          if (!localDataRef[u]) {
            localDataRef[u] = 1;
            reducedDuplicates.push(u);
          }

          if (uniqueArray.length - 1 === i && reducedDuplicates.length) {
            axios
              .post('https://www.fansclub.app/api/v1/POST/getLikesForPolys', {
                likeOrDislike: LikeOrDislike,
                teamId: TeamId,
                reducedDuplicates,
              })
              .then(response => {
                console.log(response);
                const { likes } = response.data;
                Object.keys(likes).forEach(key => {
                  map.setFeatureState(
                    {
                      source: 'boundary-source',
                      sourceLayer: 'boundry',
                      id: key /* dataValues['USA1' + row.STATE_ID].id_int */,
                    },
                    { fans: likes[key] * 3000 }
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

    map.off('data', addToSourceOnData);

    return null;
  }

  function addLayers(teamId, likeOrDislike) {
    // if (map.getSource('boundary-source')) {
    // }

    (function loop() {
      if (map && map.isStyleLoaded()) {
        // boundary source >>
        map.addSource('boundary-source', {
          type: 'vector',
          tiles: ['https://www.fansclub.app/api/v1/GET/tiles/{z}/{x}/{y}'],
          minzoom: 0,
          maxzoom: 18,
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
            'rgba(236, 225, 203,1.0)',
            1,
            'rgba(211,47,47,1.0)',
          ],
          'rgba(255,255,255,1.0)',
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
        // map.on('data', addToSourceOnData);
        map.on('moveend', addToSourceOnMove);
        map.on('moveend', addFollowersPins);
      } else {
        setTimeout(() => {
          loop();
        }, 50);
      }
    })();
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

      // FIXME: delete on production
      window.mapbox = map;

      dispatch(mapActions.updateCenter(map.getCenter()));
      // setState({ ...state, isLoaded: true });
      map.loadImage(
        `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAJvElEQVR4Xu2da2wcVxXH/+eO7RQnjr2x4zxKAhGJwqsFUSgfKqAipdTeJSheLx9a8RICVJUmIUIICQFFCBAC1AYqVBCqCgK++BWCJ24pVSoFQRCPAgWClKYpdZomSnfXjmPHWe/cg2bdNSbNej3rvbMz9975uueeuf/z/+XM3DszDsEeRleAjFZvxcMCYDgEFgALgOEVMFy+7QAWAMMrYLh82wEsAIZXwHD5tgNYAAyvgOHybQewABheAcPl2w5gATC8AobLtx3AAmB4BQyXbzuABcDwChgu33YAC4DhFTBcvu0AFgDDK2C4fNsBLACGV8Bw+bYDWAAMr4Dh8m0HsADEowIMUD6V2eIAGxncBukJj5zpZo+ybW04TQMDhTCVcE/Pqile89o5hzsd9lZDOJJAUx5wLjE6ME4AhzmfWs8V2Q7AmYwzOV18L0PcAeBdTPIGgrjuWkKllBIQp0D8WxLiCU8UDq8/fHiq1qJca1y25661JGZ3M7ALErcA8nVCCHGtWIacJRZPAzhGxGPtrc5RGhjw6jmfeuWKHAAXdu/e7BRb9hHjoxC8oRahvgFg8UvH4e+2/2r4j7XkKI+ZTGVu9qQ8AJIfrARg1fySzjPhJ15T4eD6w4fPVo0PMSAyAEwk70wwCl+V0vu0EKKlfjWgx6Wk/Z1jA/8KkjOX3PNmBh4QELuCjFsqVkpZEML5IaHlKx3uL/L1yruSPJEAYKI3nfaYHxKCuiqLIVBzE9CyCnCaQH73ZQazBAoF8OwsKl12JVB0CN9pv5T9Ej35ZHGpgvFNn2rOb8p+nT15QAjhrKS4lcZKyS85Du7uGB0eVJE/SM6GAuAXe3Jj9iADd19r0tTUDFrbDlqzFqK1FXAq+8Fzc/DOvQC+OFlRPxGOex5nOseGz1wrKJfKbCUpB0F4R5Ai1hpLjIfaz3fupT//aK7WHCsd1zAAzt3+4dUtzswQCbz/ahH0qlaI9d0QbWuBIH/CgBnFkyfgw1DxYIxLFndcfUnI9WZuIOZHIXjzSosaZDxLPFZcI/q7BwYuBRlXr9iGAOCbv6p55jHAv5v+30HNzRCbrodoa69ZX/HZk+DLM0uOl5A5IcVtibGhp/zAiWTmJk/K3wiBjppPvIKBJPn3hTXO7Y2AIHQASsu7GR5lsL+8Wzj8Vt+0ecuSbb5ajXlmGsXTpyreCyweX4KAm3aBJUngCSGQqJZf5e8EerS9lVJhLxdDB2Ailf4mM76wuJiiqxvOhk1L1pfnCvM3e4Ur4KK/pF60zyIl+PJl8HSwpb+UyPonFQKdKs1dbm4Cf6PDHf7icuPrERcqAPkPZN4jpTwqFl3YnfUbILo3vlKLf4c/NQk5dRE8fWnp63o9KhGBHP6GFgnn1nXu4LGwphMaAJzJtOQuyX8IgR1lcaW2v+U1/3+jJyVk9gK8XBYoNuzmOKz6v+I8BJxon87eWG25Wq8JhgZAvje9F4SDC+Y3t8DZvnN+Pf/yISfy8M6/aKTxiw1l0D3r3MEf1MvkpfKEAoD/r39iRj4HYOFC72zd9vIyD4CUKJ4dB09OhKE5Duc40zGd3RZGFwgFgFxv351E9PNy5f31vQ+Af3CxCO8/z4JnL8fBmNDmSKAPdbiDA6pPGAoA+d704yDcVhbTtG07qHU1UCxi7vQzQOGKap0xzE9uwh1MqZ64cgD8hzyevHyhvK9Oq65D0/adYMnwnnum6qaN6gJENb//4Mhb09SpenNIOQD5ZH8fwEPlQjsbr4fo7IJ3dhwyn4tq/SMxLwan1rnDrsrJKAcg19v/LSL+fFlE847XQ16Zhfe8f09oj6UrwF9LuMNfVlkl5QBMJNMuA72+CPKXfjt2wjv5byM2dlZqnJQ00jk22LfSPA1dBuaTe/4JiDf6kxCJdUBLC+T5cyo1aZPbI++prtFDb1MpSHkHyKbS5wWjuwRA98bSLh+8SL4ep7LOteWW8oXE2Miraxu8vFHKAcj3pC9CoK0EQFs75FTlFzaWN2Vzovwnlp3uiNIHVcoByPak8+Xn7P7z/iVf1jDH22Up9SAvdLkjpe6p6lAOQL43/TwIW1QJ0DmvB5zqcoe2q9QYAgB9fwDRzSpFaJub5bHEkZF3q9SnHoBk388AukulCH1zy4cT7sgnVOpTDsBEsv9zDP62ShH65ua9CXf4+yr1KQdgsjf9Tkk4rlKEtrlJvjUxOvI3lfqUA8D33Sdyf3r6xfJegEoxmuU+0+EObVX9kalyAHxT8qn0g2Dco5lBquXcn3CHDqg+SUgA7HkLWPxVtRid8ksp3hT0e8Za9IcCQKkLJPt/DfD7apmkaWMIONLhDiXD0B0aAP5n1kWWxxe/Eh6GwLidQwLsEL+9Y3T4L2HMPTQAfDHZ3r6HBdHHwxAW23MQ/zgxOvzJsOYfKgDzfwPgyt8BKH3CFVbx6n4exjhavBsThw6F9np0qAD4Bcv19N3Cgo8KiOa6FzDGCSXkHODc2ukO/i5MGaEDML8s7P+IZH7E3g/MW+1f9wXRxxKjgz8N03z/XA0BoNQJUunPEEPpNmfYxaz5fIx9iSND36t5/AoGNgyAUie46nOxFeiI79AGmt/QDlB2LJ/s2w/Q/fF1cCUzV/+wp9rsGtoBTIaACfeuGx16sJpBqn+PBACly4FBnSAq5kfiErCYcBMgiJL5kQNA904QNfMjCYCuEETR/MgCoBsEUTU/0gDoAkGUzY88AHGHIOrmxwKAEgSp9D4wHlC9Jq5v/sZv8ixHT2T2AapNNl4QxMP82HSAhR3DWHSC+JgfOwCifzmIl/mxBCC6EMTP/NgCED0I4ml+rAGIDgTxNT/2AJQgaORLJQ1+maPaymk5v8dmGbiUmIZAoIH5WnSAhSVimJ1AE/O1AiC0y4FG5msHgHIINDNfSwCUQaCh+doCUHcINDVfawDqBoHG5msPQAmCZN+9ANX21Q1hf2J0aOH/OVrOujpuMVrsA1Qrek0QGGC+ER1gYZ8gSCcwxHyjAFj25cAg840DoCoEhplvJAAVITDQfGMBKEMgQaU7fEH4rO53+5VulI1YBVQS/1Jyzxv837rckRPVVhK6/m40ALqaGkSXBSBItTSMtQBoaGoQSRaAINXSMNYCoKGpQSRZAIJUS8NYC4CGpgaRZAEIUi0NYy0AGpoaRJIFIEi1NIy1AGhoahBJFoAg1dIw1gKgoalBJFkAglRLw1gLgIamBpFkAQhSLQ1jLQAamhpEkgUgSLU0jLUAaGhqEEkWgCDV0jDWAqChqUEkWQCCVEvDWAuAhqYGkWQBCFItDWMtABqaGkSSBSBItTSMtQBoaGoQSRaAINXSMPa/FKU/rqP20QwAAAAASUVORK5CYII=`,
        (error, image) => {
          console.log('imaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaage', image);
          if (error) console.log('err on adding new image ', error);
          map.addImage('love-1', image);
        }
      );
    }

    window.addEventListener('resize', setChartWidthFunc);

    return () => window.removeEventListener('resize', setChartWidthFunc);
  }, []);

  if (state.mode === 2) {
    setChartWidthFunc();
    const split = pathname.split('/');
    const teamId = split[split.length - 1];
    const likeOrDislike = split[split.length - 2];

    // NOTE: check if teamId has been changed
    // if (teamId === TeamId) {
    //   if (likeOrDislike === 'like') {
    //   } else if (likeOrDislike === 'dislike') {
    //   }
    // } else
    if (teamId !== TeamId || likeOrDislike !== LikeOrDislike) {
      // TODO: clear previous layers after changing team or mode
      TeamId = teamId;
      LikeOrDislike = likeOrDislike;
      // setState({ ...state, teamId, likeOrDislike });
      console.log('================', state);
      _totalLikes = null;
      getClub(teamId);
      getClubTotalLikes(teamId, likeOrDislike);
      if (likeOrDislike === 'like') {
        addLayers(teamId, 'like');
      } else if (likeOrDislike === 'dislike') {
        addLayers(teamId, 'dislike');
      }
    }
  }

  if (state.mode !== 2 && TeamId) {
    setState({ ...state, teamId: null });
    setHelper({
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
  }

  if (state.mode !== 2 && !TeamId) {
    if (map) {
      map.off('moveend', addFollowersPins);

      if (map.getLayer('likes')) {
        map.removeLayer('likes');
        map.removeSource('likes');
      }
      if (map.getLayer('dislikes')) {
        map.removeLayer('dislikes');
        map.removeSource('dislikes');
      }

      if (map.getLayer('boundaryLine')) map.removeLayer('boundaryLine');
    }
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
                {state.legends === 0 ? (
                  <FormatListBulletedRoundedIcon />
                ) : (
                  <TrendingUpRoundedIcon />
                )}
              </Link>
            </IconButton>
          </div>

          <div id="link-legend" className="legend-Link">
            <IconButton style={{ padding: 3, color: '#263238' }} onClick={handleShreButtons}>
              <LinkRoundedIcon />
            </IconButton>
          </div>
          {openShareButtons ? <ShareButtons url={window.location.href} c="content" /> : null}
        </>
      ) : null}
    </>
  );
}

export default withRouter(Map);
