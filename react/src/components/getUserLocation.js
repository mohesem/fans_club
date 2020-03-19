// import debug from 'debug';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

// material-ui components
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// theme
import errorTheme from '../themes/error';

// actions
import signupActions from '../actions/signup';

// --debuger
// const log = debug('log:getUserLocaationNav');

const useStyles = makeStyles(theme => ({
  container: {
    padding: '0px',
    textAlign: 'center',
    // position: 'absolute',
    // top: 61,
  },
  typoContainer: {
    backgroundColor: 'rgb(29, 41, 51)',
    height: 'fit-content',
    width: '100%',
    padding: '10px',
  },
  address: {
    margin: '10px',
    color: 'white',
  },
  submitBtnTxt: {
    lineHeight: 0,
    color: 'chocolate',
  },
}));

const RedirectToLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

export default function AGketUserLocationdNav() {
  const signupReducer = useSelector(state => state.signup);
  const dispatch = useDispatch();
  const classes = useStyles();

  return (
    <>
      <CssBaseline />

      <Container maxWidth="xl" className={classes.container}>
        <Typography component="div" className={classes.typoContainer}>
          <h3 className={classes.address}>{signupReducer.address}</h3>
          <ThemeProvider theme={errorTheme}>
            <Button
              color="primary"
              component={RedirectToLink}
              to="/"
              onClick={() => {
                dispatch(
                  signupActions({
                    location: undefined,
                    address: undefined,
                  })
                );
              }}
            >
              Cancel
            </Button>
          </ThemeProvider>
          {signupReducer.submitButtonState ? (
            <Button color="secondary" component={RedirectToLink} to="/signup">
              Submit
            </Button>
          ) : (
            <Button color="secondary" disabled>
              {signupReducer.address === null ? (
                <p className={classes.submitBtnTxt}>submit</p>
              ) : (
                <CircularProgress color="secondary" size="20px" />
              )}
            </Button>
          )}
        </Typography>
      </Container>
    </>
  );
}
