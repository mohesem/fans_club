import debug from 'debug';

import React, { useState } from 'react';
import { Redirect /* Link as  RouterLink */ } from 'react-router-dom';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import { /* useSelector */ useDispatch } from 'react-redux';
import hello from 'hellojs';
import { useSnackbar } from 'notistack';

// material-ui component
import { makeStyles /* ThemeProvider */ } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// api
import signinApi from '../api/signin';

// componnet
import ModalError from './modalError';

// actions
import userAction from '../actions/user';

// --debugger
const log = debug('log:signinComponent');

const useStyles = makeStyles(theme => ({
  groupButton: {
    marginTop: '10%',

    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
  image: {
    backgroundImage: 'url(./img/4.jpeg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  paper: {
    margin: '25% 10% 10% 10%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    height: '100vh',
    marginTop: theme.spacing(1),
    background: theme.palette.background.default,
  },
  formStyle: {
    '& > *': {
      margin: '3% 0%',
    },
  },
  title: {
    marginBottom: '20%',
  },
}));

hello.init(
  {
    facebook: '726965834493962',
    google: '951334179095-359plh303nv4b6oi184594gi11jmpvfk.apps.googleusercontent.com',
  },
  { redirect_uri: 'https://www.fansclub.app/auth/google/callback' }
);

export default function Singin() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [state, setState] = useState({
    modalErrors: [],
    redirect: false,
    try: false,
  });
  const [user, setUser] = useState({});

  function onModalErrorClose() {
    setState({ ...state, modalErrors: [] });
  }

  if (state.try === true) {
    setState({ ...state, try: false });
    log('this fucking shit is working ');
    signinApi(user)
      .then(res => {
        log(res);
        localStorage.setItem('fans_club', res.data.token);
        setState({ ...state, redirect: '/' });
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
        enqueueSnackbar(`${res.data.snackMsg}`, { variant: 'success' });
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

  return (
    <>
      {state.redirect ? <Redirect to={state.redirect} push /> : null}

      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={12} md={12} className={classes.image} />
        <Grid item xs={false} sm={2} md={3} />
        <Grid
          className={classes.form}
          item
          xs={12}
          sm={8}
          md={6}
          component={Paper}
          elevation={6}
          square
        >
          <div className={classes.paper}>
            <Typography className={classes.title} color="secondary" component="h5" variant="h3">
              Signin
            </Typography>
            <FormControl fullWidth className={classes.formStyle} variant="outlined">
              <Typography color="primary" className={classes.instructions}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </Typography>
              <GoogleLoginButton
                onClick={() => {
                  hello('google')
                    .login({
                      scope: 'email',
                    })
                    .then(
                      resp => {
                        console.log(resp);
                        hello('google')
                          .api('me')
                          .then(
                            handler => {
                              console.log('handler', handler);

                              setUser({
                                from: 'google',
                                email: handler.email,
                                firstname: handler.first_name,
                                lastname: handler.last_name,
                                fullname: handler.name,
                                picture: handler.picture,
                                thumbnail: handler.thumbnail,
                                googleId: handler.id,
                              });
                              setState({ ...state, try: true });
                            },
                            e => {
                              setState({ ...state, modalErrors: [{ msg: e.error.message }] });
                            }
                          );
                      },
                      e => {
                        console.log(e);
                        setState({ ...state, modalErrors: [{ msg: e.error.message }] });
                      }
                    );
                }}
              />
              <FacebookLoginButton
                onClick={() => {
                  hello('facebook')
                    .login()
                    .then(
                      resp => {
                        console.log(resp);
                        hello('facebook')
                          .api('me')
                          .then(
                            handler => {
                              console.log(handler);

                              setUser({
                                from: 'facebook',
                                email: handler.email,
                                firstname: handler.first_name,
                                lastname: handler.last_name,
                                fullname: handler.name,
                                picture: handler.picture,
                                thumbnail: handler.thumbnail,
                                facebookId: handler.id,
                              });
                              setState({ ...state, try: true });
                            },
                            e => {
                              setState({ ...state, modalErrors: [{ msg: e.error.message }] });
                            }
                          );
                      },
                      e => {
                        console.log('*******', e);
                        setState({ ...state, modalErrors: [{ msg: e.error.message }] });
                      }
                    );
                }}
              />
              {/* TODO: check it */}
              {/* <h3 style={{ color: '#dd2c00', marginBottom: '-15px' }}>{msg}</h3> */}
            </FormControl>
          </div>
        </Grid>
        <Grid item xs={false} sm={2} md={3} />
      </Grid>

      {state.modalErrors.length ? (
        <ModalError errors={state.modalErrors} handleClick={onModalErrorClose} />
      ) : null}
    </>
  );
}
