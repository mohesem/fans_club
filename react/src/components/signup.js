// debug
import debug from 'debug';
import React, { useState } from 'react';
import { Redirect, Link as RouterLink } from 'react-router-dom';
import { useSelector /* useDispatch */ } from 'react-redux';
import { useSnackbar } from 'notistack';
import hello from 'hellojs';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

// material-ui component
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

// api
import makeNewUsedrApi from '../api/makeNewUser';
import isUserNewApi from '../api/isUserNew';
// action
/*  */

// theme
import errorTheme from '../themes/error';

// COMPONENT
import ModalError from './modalError';

// --debug
const log = debug('log:signupComponent');

const RedirectToLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
  image: {
    backgroundImage: 'url(./img/3.jpeg)',
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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    height: '100vh',
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  activeAccountBtn: {
    margin: '21px 0px',
  },
  paper: {
    margin: '25% 10% 10% 10%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  stepper: {
    padding: theme.spacing(0),
    margin: theme.spacing(0, 0, 2, 0),
    background: theme.palette.background.default,
    width: '-webkit-fill-available',
    marginBottom: '20%',
  },
  stepperBody: {
    '& > *': {
      marginBottom: '7%',
    },
  },
  stepperBodyParrent: {
    width: '-webkit-fill-available',
    textAlign: 'center',
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

export default function Signup() {
  const { enqueueSnackbar } = useSnackbar();
  // const dispatch = useDispatch();
  const signupReducers = useSelector(state => state.signup);

  const classes = useStyles();

  // local states
  const [state, setState] = useState({
    modalErrors: [],
    submitOnHold: false,
    redirect: false,
    selectedDate: new Date(0),
    gender: undefined,
    genderErr: undefined,
    isNewUser: undefined,
    activeStep: 0,
    try: false,
  });

  const [user, setUser] = useState({});

  function getSteps() {
    return ['submit location', 'signup with', 'complete registration'];
  }
  const steps = getSteps();

  function handleChange(event) {
    setState({ ...state, gender: event.target.value });
  }

  function handleBack() {
    setState({ ...state, activeStep: state.activeStep - 1 });
  }

  function onModalErrorClose() {
    setState({ ...state, modalErrors: [] });
  }

  function handleDateChange(e) {
    log('DATE', e);
    setState({ ...state, selectedDate: new Date(e) });
  }

  function signup(_user) {
    return new Promise((resolve, reject) => {
      console.log(user);
      const extendedUser = _user;
      extendedUser.location = signupReducers.location;
      extendedUser.address = signupReducers.address;
      extendedUser.birth = state.selectedDate;
      extendedUser.gender = state.gender;

      log('extendedUser', extendedUser);
      makeNewUsedrApi(extendedUser)
        .then(res => {
          log('newUserApi res', res);
          localStorage.setItem('fans-club', res.data.token);
          enqueueSnackbar(`${res.data.snackMsg}`, { variant: 'success' });
          /* TODO: change user reducer */
          resolve();
        })
        .catch(err => {
          if (err.status === 503) {
            enqueueSnackbar('Network Error', { variant: 'error' });
          } else {
            log(err);
            setState({
              ...state,
              modalErrors: [err],
            });
          }
          reject();
        });
    });
  }

  if (state.try === true) {
    // setState({ ...state, try: false });

    isUserNewApi(user.email)
      .then(res => {
        console.log('reeeeeeeeeeeees', res);
        setState({
          ...state,
          isNewuser: true,
          try: false,
        });
      })
      .catch(err => {
        console.log('errrrrrrrrrrrrrrrrrrr', err);
        if (err === 'network error') {
          setState({
            ...state,
            modalErrors: [{ other: 'network error' }],
            isNewuser: false,
            try: false,
          });
        } else {
          setState({
            ...state,
            modalErrors: [err],
            isNewuser: false,
            try: false,
          });
        }
      });
  }

  const handleNext = () => {
    if (state.activeStep === 1) {
      return setState({ ...state, activeStep: state.activeStep + 1 });
    }
    if (state.activeStep === 2) {
      if (state.selectedDate && state.gender) {
        signup(user)
          .then(() => {
            return setState({ ...state, activeStep: state.activeStep + 1 });
          })
          .catch(() => {
            return false;
          });
      }

      if (!state.gender) {
        setState({ ...state, genderErr: true });
      }

      if (state.gender) {
        setState({ ...state, genderErr: false });
      }
    } else {
      return setState({ ...state, activeStep: state.activeStep + 1 });
    }
    return undefined;
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <>
            {signupReducers.location ? (
              <div className={classes.stepperBody}>
                <Typography className={classes.instructions}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </Typography>

                <Typography className={classes.instructions}>
                  {signupReducers.address || undefined}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={state.submitOnHold === true}
                  component={RedirectToLink}
                  to="/signup/getUserLocation"
                >
                  change your location
                </Button>
              </div>
            ) : (
              <div className={classes.stepperBody}>
                <Typography className={classes.instructions}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={state.submitOnHold === true}
                  component={RedirectToLink}
                  to="/signup/getUserLocation"
                >
                  Choose your location on map
                </Button>
              </div>
            )}
          </>
        );
      case 1:
        return (
          <div className={classes.stepperBody}>
            <Typography className={classes.instructions}>Signin with</Typography>
            <FormControl fullWidth disabled={signupReducers.location === undefined}>
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
                        setState({ ...state, modalErrors: [{ msg: e.error.message }] });
                      }
                    );
                }}
              />
            </FormControl>
          </div>
        );
      case 2:
        return (
          <div className={classes.stepperBody}>
            <Typography className={classes.instructions}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </Typography>

            <FormControl fullWidth className={classes.formStyle} variant="outlined" noValidate>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  disableFuture
                  openTo="year"
                  format="dd/MM/yyyy"
                  label="Date of birth"
                  views={['year', 'month', 'date']}
                  value={state.selectedDate}
                  onChange={handleDateChange}
                />
              </MuiPickersUtilsProvider>
              <FormLabel
                component="legend"
                style={{
                  fontWeight: 600,
                  textAlign: 'left',
                  margin: '30px 0px 15px 0px',
                  fontSize: 'large',
                  color: 'rgb(230, 230, 250)',
                  background: '#4caf50',
                  width: 'fit-content',
                  padding: '10px',
                  borderRadius: '5px',
                }}
              >
                Gender
              </FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={state.gender}
                onChange={handleChange}
                row
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
              <FormHelperText>
                {state.genderErr === true ? 'gender is required' : undefined}
              </FormHelperText>
            </FormControl>
            {state.modalErrors.length ? (
              <ModalError errors={state.modalErrors} handleClick={onModalErrorClose} />
            ) : (
              undefined
            )}
          </div>
        );
      default:
        return 'Unknown step';
    }
  }

  function handleNextDisable() {
    let val = true;
    if (state.activeStep === 0 && signupReducers.location) {
      val = false;
    }
    if (state.activeStep === 1 && state.isNewuser === true) {
      val = false;
    }
    if (state.activeStep === 2) {
      val = false;
    }
    return val;
  }

  return (
    <>
      {state.redirect ? <Redirect to={state.redirect} push /> : undefined}

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
              Signup
            </Typography>
            <Stepper activeStep={state.activeStep} alternativeLabel className={classes.stepper}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <div className={classes.stepperBodyParrent}>
              {state.activeStep === steps.length ? (
                <div className={classes.stepperBody}>
                  <Typography className={classes.instructions}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <ThemeProvider theme={errorTheme}>
                    <Button
                      color="primary"
                      component={RedirectToLink}
                      to="/"
                      className={classes.button}
                    >
                      Back To Home
                    </Button>
                  </ThemeProvider>
                </div>
              ) : (
                <>
                  <div className={classes.instructions}>{getStepContent(state.activeStep)}</div>
                  <div>
                    <ThemeProvider theme={errorTheme}>
                      <Button
                        disabled={state.activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}
                        color="primary"
                        variant="contained"
                      >
                        Back
                      </Button>
                    </ThemeProvider>

                    <Button
                      variant="contained"
                      disabled={handleNextDisable()}
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {state.activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Grid>
        <Grid item xs={false} sm={2} md={3} />
      </Grid>

      {state.modalErrors.length ? (
        <ModalError errors={state.modalErrors} handleClick={onModalErrorClose} />
      ) : (
        undefined
      )}
    </>
  );
}
