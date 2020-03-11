import debug from 'debug';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// material-ui
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import MoreIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// actions
import userAction from '../actions/user';
// api
import getUserInfoApi from '../api/getUserInfo';

// --debuger
const log = debug('log:Appbar');
// creating style
const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    // TODO: check it later
    flexGrow: 1,
  },
  linearProgress: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  appbar: {
    backgroundColor: '#263238',
    borderBottom: 'solid 6px #4caf50',
  },
}));

const redirectTo = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);
export default function Appbar() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  // redirect helper

  // states
  const [state /* setState */] = useState({
    redirect: false,
  });
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(undefined);

  // global states
  const userReducer = useSelector(reduxState => reduxState.user);

  // handling @media
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  log(userReducer);

  if (userReducer.isValid === undefined) {
    if (localStorage.fans_club) {
      getUserInfoApi(localStorage.fans_club)
        .then(res => {
          log('appbar getUserInfo valid res', res);
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
          // TODO: ADD TO USER REDUCER
        })
        .catch(err => {
          log('appbar getUserInfo valid err', err);
          if (err.status === 503) {
            dispatch(userAction({ isValid: false }));
            enqueueSnackbar('Network Error', { variant: 'error' });
          } else {
            log('other error messages on getUserInfo Api', err);
            dispatch(userAction({ isValid: false }));
            enqueueSnackbar(err.msg, { variant: 'error' });
          }
        });
    } else {
      log('no token has been found for fans_club');
      dispatch(userAction({ isValid: false }));
      enqueueSnackbar('Signup to get more ...', { variant: 'error' });
    }
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(undefined);
  };

  const handleMenuClose = () => {
    // setAnchorEl(undefined);
    handleMobileMenuClose();
  };

  const handleLogOut = () => {
    localStorage.removeItem('fans_club');

    dispatch(
      userAction({
        isValid: undefined,
        firstname: undefined,
        lastname: undefined,
        likes: undefined,
        dislikes: undefined,
        suggests: undefined,
        location: undefined,
      })
    );
  };

  function renderMobileMenu() {
    switch (userReducer.isValid) {
      case false:
        return (
          <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <Button
                className="appbarButton"
                color="secondary"
                component={redirectTo}
                to="/signup"
              >
                Signup
              </Button>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Button color="secondary" component={redirectTo} to="/signin">
                Signin
              </Button>
            </MenuItem>
          </Menu>
        );
      case true:
        return (
          <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
          >
            {/* <MenuItem onClick={handleMenuClose}>
              <Button color="secondary" component={redirectTo} to="/profile">
                profile
              </Button>
            </MenuItem> */}
            <MenuItem onClick={handleMenuClose}>
              <Button color="secondary" component={redirectTo} to="/clubs">
                teams
              </Button>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Button color="secondary" component={redirectTo} to="/" onClick={handleLogOut}>
                logout
              </Button>
            </MenuItem>
          </Menu>
        );
      default:
        return undefined;
    }
  }

  const isNotuserContent = (
    <>
      <div className={classes.sectionDesktop}>
        <Button className="appbarButton" color="secondary" component={redirectTo} to="/signup">
          Signup
        </Button>
        <Button color="secondary" component={redirectTo} to="/signin">
          Signin
        </Button>
      </div>
      <div className={classes.sectionMobile}>
        <IconButton
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
        >
          <MoreIcon color="secondary" />
        </IconButton>
      </div>
    </>
  );

  const getUserInfoContent = (
    <>
      <div className={classes.sectionDesktop}>
        {/* <Button color="secondary" component={redirectTo} to="/profile">
          profile
        </Button> */}
        <Button color="secondary" component={redirectTo} to="/clubs">
          teams
        </Button>
        <Button color="secondary" component={redirectTo} to="/" onClick={handleLogOut}>
          logout
        </Button>
      </div>
      <div className={classes.sectionMobile}>
        <IconButton
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
        >
          <MoreIcon color="secondary" />
        </IconButton>
      </div>
    </>
  );

  function toolbarContent() {
    let content;
    if (userReducer.isValid === undefined) content = <p>loading</p>;
    if (userReducer.isValid === false) content = isNotuserContent;
    if (userReducer.isValid === true) content = getUserInfoContent;

    return content;
  }

  return (
    <>
      {state.redirect ? <Redirect to={state.redirect} push /> : undefined}
      {userReducer.isValid === undefined ? (
        <div className="loading-wrapper">
          <div className="wrap">
            <div className="loading">
              <div className="bounceball" />
              {/* <div className="text">NOW LOADING</div> */}
            </div>
          </div>
        </div>
      ) : (
        undefined
      )}
      <div className={classes.grow}>
        <AppBar position="static" className={classes.appbar}>
          <Toolbar>
            <Typography variant="h5" className={classes.title}>
              <Button component={redirectTo} to="/" style={{ color: 'white' }}>
                <Typography variant="h5" className={classes.title}>
                  FANS CLUB
                </Typography>
              </Button>
            </Typography>

            {toolbarContent()}
          </Toolbar>
          {userReducer.isValid === undefined ? (
            <div className={classes.linearProgress}>
              <LinearProgress />
            </div>
          ) : (
            undefined
          )}
        </AppBar>
        {renderMobileMenu()}
      </div>
    </>
  );
}
