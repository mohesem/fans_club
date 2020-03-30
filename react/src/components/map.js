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
import {
  FacebookShareCount,
  PinterestShareCount,
  VKShareCount,
  OKShareCount,
  RedditShareCount,
  TumblrShareCount,
  FacebookShareButton,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  WeiboShareButton,
  PocketShareButton,
  InstapaperShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon,
  MailruIcon,
  EmailIcon,
  LivejournalIcon,
  ViberIcon,
  WorkplaceIcon,
  LineIcon,
  PocketIcon,
  InstapaperIcon,
  WeiboIcon,
} from 'react-share';

// actions
import signupActions from '../actions/signup';
import mapActions from '../actions/map';
import clubAction from '../actions/club';

// API
import getAddressFromMapboxApi from '../api/getAddressFromMapbox';
import getMembersFromPoly from '../api/getMembersFromPoly';

// components
import GetUserlocationNav from './getUserLocation';

const shareUrl = window.location.href;
const title = 'Fans Club';

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
const fsLength = 0;
const searchMarker = null;
const clubMarker = null;
const userLocationMarker = null;
const coordsArray = [];

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
    }

    // window.addEventListener('resize', setChartWidthFunc);

    // return () => window.removeEventListener('resize', setChartWidthFunc);
  }, []);

  if (state.mode === 2) {
    const split = pathname.split('/');
    const teamId = split[split.length - 1];
    const likeOrDislike = split[split.length - 2];

    // NOTE: check if teamId has been changed
    if (teamId === state.teamId) {
      if (likeOrDislike === 'like') {
      } else if (likeOrDislike === 'dislike') {
      }
    } else if (teamId !== state.teamId) {
      setState({ ...state, teamId });
      _totalLikes = null;
      getClub(teamId);
      getClubTotalLikes(teamId, likeOrDislike);
      if (likeOrDislike === 'like') {
      } else if (likeOrDislike === 'dislike') {
      }
    }
  }

  if (state.mode !== 2 && state.teamId) {
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

  return (
    <>
      {handleRoutes()}
      <div
        ref={function ref(el) {
          mapContainer = el;
        }}
        className="mapContainer"
      />
    </>
  );
}

export default withRouter(Map);
