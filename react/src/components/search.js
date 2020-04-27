import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { withRouter, Redirect } from 'react-router-dom';
import debug from 'debug';
import { useSnackbar } from 'notistack';

// material-ui component
import { makeStyles, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import RoomIcon from '@material-ui/icons/Room';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import ThumbDownAltRoundedIcon from '@material-ui/icons/ThumbDownAltRounded';

// actions
import mapActions from '../actions/map';
import clubAction from '../actions/club';
import searchAction from '../actions/search';

// api
import searchClubsApi from '../api/searchClubs';

// --debug
const log = debug('log:search');

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    maxWidth: 400,
    margin: 10,
    borderRadius: 100,
    background: '#ffffffbd',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    margin: 5,
    color: theme.palette.primary.main,
    background: '#bdbdbd82',
  },
  iconButtonSelected: {
    color: 'white',

    padding: 10,
    margin: 5,
    background: theme.palette.primary.main,
    '&:hover': {
      background: theme.palette.secondary.main,
    },
  },
  divider: {
    height: 28,
    margin: 4,
  },
  searchInput: {
    borderRadius: '100px',
  },
}));

function Search(props) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // reducers
  const mapCenterReducer = useSelector(global => global.map.center);
  const searchModeReducer = useSelector(global => global.search);

  const [state, setState] = useState({
    modalErrors: [],
    searchMode: 'team',
    open: false,
  });

  const [options, setOptions] = useState([]);

  const [redirect, setRedirect] = useState(false);

  const { location } = props;
  const { pathname } = location;

  function handleRedirect(val) {
    setRedirect(`/v/${searchModeReducer}/${val._id}`);
  }

  if (redirect) {
    setTimeout(() => {
      setRedirect('');
    }, 0);
  }

  const pathArr = pathname.split('/');
  if (pathArr[2] != searchModeReducer && pathArr[2]) {
    dispatch(searchAction(pathArr[2]));
  }

  function handleChangeTeamSearchMode() {
    if (searchModeReducer === 'like') {
      dispatch(searchAction('dislike'));
      if (pathArr.length > 3) {
        setRedirect(`/v/dislike/${pathArr[3]}`);
      }
    } else {
      dispatch(searchAction('like'));
      if (pathArr.length > 3) {
        setRedirect(`/v/like/${pathArr[3]}`);
      }
    }
  }

  const loading = state.open && options.length === 1;
  const classes = useStyles();

  // "chester.json?proximity=-74.70850,40.78375&access_token=pk.eyJ1IjoibW9oZXNlbSIsImEiOiJjanR3amhqcWcxZm05NDVtcG03Nm44Ynk4In0.YUdlvT5fABnW8BReNMSuPg"
  function getPlacesFromMapbox(str) {
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${str}.json?proximity=${mapCenterReducer.lng},${mapCenterReducer.lat}&access_token=pk.eyJ1IjoibW9oZXNlbSIsImEiOiJjanR3amhqcWcxZm05NDVtcG03Nm44Ynk4In0.YUdlvT5fABnW8BReNMSuPg`
      )
      .then(response => {
        const { features } = response.data;
        const newOptions = features.map(f => {
          // console.log(f);
          if (f.bbox) {
            return { name: f.place_name, center: f.bbox };
          }
          return { name: f.place_name, center: f.center };
        });
        // console.log('new options are :: ', newOptions);
        setOptions(newOptions);

        // setState({ ...state, options: newOptions });
      })
      .catch(error => {
        console.log(error);
        if (error.response) {
          console.log(error.response);
          // reject(error.response.data.msg);
        }
      });
  }

  console.log('options are ::', options);

  function getClubs(str) {
    // console.log(str);
    searchClubsApi(str)
      .then(res => {
        // log('search result is', res);
        // setState({ ...state, options: res.data.clubs });

        setOptions(res.data.clubs);
      })
      .catch(err => {
        log(err);
        if (err.status === 503) {
          enqueueSnackbar('Network Error', { variant: 'error' });
        } else {
          log(err);
          setState({
            ...state,
            modalErrors: [err],
          });
        }
      });
    // axios
    //   .post(`https://www.fansclub.app/club/search`, { str })
    //   .then(response => {
    //     const { clubs } = response.data;
    //     console.log(clubs);

    //     setOptions(clubs);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }

  function handleSeachButton(name) {
    // setOptions([]);
    setState({ ...state, searchMode: name });
  }

  return (
    <>
      {redirect ? <Redirect to={redirect} push /> : null}

      <div style={{ textAlign: 'center' }}>
        <Paper className={classes.root} id="searchComponent">
          <IconButton
            className={
              state.searchMode === 'place' ? classes.iconButtonSelected : classes.iconButton
            }
            onClick={() => handleSeachButton('place')}
            aria-label="search"
          >
            <RoomIcon />
          </IconButton>
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton
            className={
              state.searchMode === 'team' ? classes.iconButtonSelected : classes.iconButton
            }
            onClick={() => handleSeachButton('team')}
            aria-label="directions"
          >
            <SportsSoccerIcon />
          </IconButton>
          {state.searchMode === 'place' ? (
            <Autocomplete
              style={{ width: 300 }}
              open={state.open}
              onOpen={() => {
                setState({ ...state, open: true });
              }}
              onClose={() => {
                setState({ ...state, open: false });
              }}
              onChange={(e, inputValue) => {
                if (inputValue) {
                  dispatch(
                    mapActions.updateFlyTo({
                      state: true,
                      coord: inputValue.center,
                    })
                  );
                }
              }}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={option => option.name}
              options={options}
              loading={loading}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder="search places"
                  fullWidth
                  variant="outlined"
                  onChange={e => {
                    getPlacesFromMapbox(e.target.value);
                  }}
                />
              )}
            />
          ) : (
            <Autocomplete
              style={{ width: 300 }}
              open={state.open}
              onOpen={() => {
                setState({ ...state, open: true });
              }}
              onClose={() => {
                setState({ ...state, open: false });
              }}
              onChange={(e, inputValue) => {
                if (inputValue) {
                  handleRedirect(inputValue);
                }
              }}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={option => option.name}
              options={options}
              loading={loading}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder="search teams"
                  fullWidth
                  variant="outlined"
                  onChange={e => {
                    getClubs(e.target.value);
                  }}
                />
              )}
            />
          )}
          {state.searchMode === 'team' ? (
            <IconButton
              // className={
              //   state.searchMode === 'place' ? classes.iconButtonSelected : classes.iconButton
              // }
              onClick={() => handleChangeTeamSearchMode()}
              aria-label="search"
            >
              {searchModeReducer === 'like' ? (
                <ThumbUpAltRoundedIcon style={{ color: '#4caf50' }} />
              ) : (
                <ThumbDownAltRoundedIcon style={{ color: '#f44336' }} />
              )}
            </IconButton>
          ) : null}
          {/* <Button>
            <ThumbUpAltRoundedIcon />
          </Button> */}
        </Paper>
      </div>
    </>
  );
}

export default withRouter(Search);
