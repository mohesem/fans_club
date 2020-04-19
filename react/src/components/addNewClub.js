/* eslint-disable react/prop-types */
import debug from 'debug';
import React, { useState } from 'react';
// import { Redirect } from 'react-router-dom';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';

// material-ui component
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';

// API
import searchClubsApi from '../api/searchClubs';
import likeClubApi from '../api/likeClub';
import dislikeClubApi from '../api/dislikeClub';

// themes
import errorTheme from '../themes/error';

// actions
import userAction from '../actions/user';

// component
import ModalError from './modalError';

// --debugger
const log = debug('log:addNewTeam');

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function AddNewClub(props) {
  const dispatch = useDispatch();

  const [open /* setOpen */] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  log(props);

  const [state, setState] = useState({
    modalErrors: [],
    club: null,
    clubOptions: [],
    value: null,
  });

  const classes = useStyles();
  const loading = open && state.clubOptions.length === 1;

  const handleClose = () => {
    // setOpen(false);
    props.handleClose();
  };

  function handleSearch(clubObj) {
    setState({ ...state, club: clubObj, clubOptions: [] });
  }

  function getClubs(str) {
    console.log(str);
    searchClubsApi(str)
      .then(res => {
        log('search result is', res);
        setState({ ...state, clubOptions: res.data.clubs });
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
  }

  function onModalErrorClose() {
    log('clooooooooooooooose modal');
    setState({ ...state, modalErrors: [] });
  }

  // function handleChange(event) {
  //   setState({ ...state, value: event.target.value });
  // }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.type}</DialogTitle>
        <DialogContent className={classes.root}>
          <DialogContentText>Add new club</DialogContentText>

          <Autocomplete
            id="seatchInput"
            className={classes.teamsSearch}
            options={state.clubOptions}
            getOptionLabel={option => option.name}
            onChange={(e, inputValue) => handleSearch(inputValue)}
            loading={loading}
            // getOptionSelected={(option, v) => option.name === v.name}
            // style={{ width: 300 }}
            renderInput={params => (
              <TextField
                {...params}
                label="Combo box"
                variant="outlined"
                fullWidth
                onChange={e => {
                  getClubs(e.target.value);
                }}
              />
            )}
          />

          {/* <Autocomplete
            // className={classes.teamsSearch}
            // style={{ width: 300 }}
            open={open}
            // onOpen={() => {
            //   setOpen(true);
            // }}
            // onClose={() => {
            //   setOpen(false);
            // }}
            value={state.value}
            onChange={(e, inputValue) => handleSearch(inputValue)}
            getOptionSelected={(option, v) => option.name === v.name}
            getOptionLabel={option => option.name}
            options={state.clubOptions}
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
          /> */}
          {/* <RadioGroup
            aria-label="gender"
            name="gender1"
            value={state.value}
            onChange={handleChange}
            row
          >
            <FormControlLabel value="like" control={<Radio />} label="like" />
            <FormControlLabel value="dislike" control={<Radio />} label="dislike" />
          </RadioGroup> */}
        </DialogContent>

        <DialogActions>
          <ThemeProvider theme={errorTheme}>
            <Button onClick={props.handleClose} color="primary" variant="contained">
              close
            </Button>
          </ThemeProvider>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              log(props.type);
              if (props.type === 'like') {
                if (state.club) {
                  likeClubApi(state.club)
                    .then(res => {
                      log(res);
                      // TODO: dispatch new like to user on redux
                      dispatch(
                        userAction({
                          isValid: true,
                          firstname: res.data.firstname,
                          lastname: res.data.lastname,
                          likes: res.data.likes,
                          dislikes: res.data.dislikes,
                          suggests: res.data.suggests,
                          location: res.data.location,
                        })
                      );
                      props.handleClose();
                    })
                    .catch(err => {
                      log('errrrrrror', err);
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
                }
              }
              if (props.type === 'dislike') {
                if (state.club) {
                  dislikeClubApi(state.club)
                    .then(res => {
                      log('dislike res is :: ', res);
                      // TODO: dispatch new like to user on redux
                      dispatch(
                        userAction({
                          isValid: true,
                          firstname: res.data.firstname,
                          lastname: res.data.lastname,
                          likes: res.data.likes,
                          dislikes: res.data.dislikes,
                          suggests: res.data.suggests,
                          location: res.data.location,
                        })
                      );
                      props.handleClose();
                    })
                    .catch(err => {
                      log('errrrrrror', err);
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
                }
              }
            }}
          >
            submit
          </Button>
        </DialogActions>
      </Dialog>
      {state.modalErrors.length ? (
        <ModalError errors={state.modalErrors} handleClose={onModalErrorClose} />
      ) : null}
    </div>
  );
}
