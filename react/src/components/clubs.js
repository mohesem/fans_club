// import debug from 'debug';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { Redirect /* Link as RouterLink */ } from 'react-router-dom';

// material-ui
import Hidden from '@material-ui/core/Hidden';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';

// COMPONENT
import ModalError from './modalError';
import AddNewClub from './addNewClub';

// Themes
import blueTheme from '../themes/blue';
import redTheme from '../themes/red';

// API
import APIDeleteClub from '../api/deleteClub';

// actions
import userAction from '../actions/user';

// --debuger
// const log = debug('log:clubs');

const useStyles = makeStyles(theme => ({
  groupBtn: {
    '& > *': {
      margin: theme.spacing(1, 0),
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
    width: '-webkit-fill-available',
    height: '-webkit-fill-available',
    // position: 'fixed',
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    zIndex: -1,
  },
  paper: {
    margin: '25% 10% 10% 10%',
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.Fix IE 11 issue.
    height: '100vh',
    marginTop: theme.spacing(1),
    background: theme.palette.background.default,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  favTeams: {
    background: '#E0E0E0',
    border: 'solid 1px #212f3a',
    borderRadius: 5,
    marginBottom: 35,
    marginTop: 25,
  },
  title: {
    marginBottom: '5%',
  },
  subTitle: {
    marginTop: 30,
  },
  text: {
    margin: 20,
  },
  formStyle: {
    width: '-webkit-fill-available',

    '& > *': {
      margin: '3% 0%',
    },
  },
}));

// const RedirectToLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

export default function Club() {
  const dispatch = useDispatch();
  const userReducer = useSelector(state => state.user);
  const classes = useStyles();

  const [state, setState] = useState({
    addNewClubModal: undefined,
    modalErrors: [],
    onHold: false,
    redirect: false,
  });
  const [onHold, setOnHold] = useState(false);

  function onModalErrorClose() {
    setState({ ...state, modalErrors: [] });
  }

  function onAddNewClubModalClose() {
    setState({ ...state, addNewClubModal: undefined });
  }

  function handleDeleteTeams(teamId, type) {
    // console.log(teamId, type);
    setOnHold(true);

    APIDeleteClub(teamId, type)
      .then(res => {
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
        console.log('...........................', res);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setOnHold(false);
      });
  }

  return (
    <>
      {state.redirect ? <Redirect to={state.redirect} push /> : null}

      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Hidden xsDown>
          <Grid item xs={false} sm={12} md={12} className={classes.image} />
        </Hidden>
        <Grid item xs={false} sm={2} md={3} />
        <Grid
          className={classes.form}
          // style={{ backgroundColor: 'red' }}
          item
          xs={12}
          sm={8}
          md={6}
          component={Paper}
          elevation={6}
          square
        >
          <div className={classes.paper}>
            {/* <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            */}
            <Typography className={classes.title} align="center" color="secondary" variant="h3">
              Clubs
            </Typography>

            <ThemeProvider theme={blueTheme}>
              <Typography className={classes.subTitle} align="left" color="primary" variant="h4">
                Likes
              </Typography>
              {userReducer.likes.length ? (
                <Typography align="left" variant="subtitle1">
                  <div className={classes.favTeams}>
                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userReducer.likes.map(team => {
                            console.log(team);
                            return (
                              <TableRow key={team._id}>
                                <TableCell component="th" scope="row">
                                  {team.name}
                                </TableCell>
                                <TableCell>{team.country}</TableCell>
                                <TableCell align="right">
                                  <Button
                                    disabled={onHold}
                                    // autoFocus
                                    color="primary"
                                    // className={classes.deleteButton}
                                    // className={classes.headerLogoutButton}
                                    onClick={() => handleDeleteTeams(team, 'like')}
                                  >
                                    delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Typography>
              ) : (
                <Typography className={classes.text} align="left" variant="subtitle1">
                  You didn&rsquo;t add any club yet
                </Typography>
              )}
              {userReducer.likes.length < 5 ? (
                <Button
                  // onClick={handleClose}
                  // className={classes.addNewTeamBtn}
                  variant="contained"
                  color="primary"
                  // component={RedirectToLink}
                  // to="/teams/addnewteam"
                  style={{ marginRight: '10px' }}
                  onClick={() => {
                    setState({ ...state, addNewClubModal: 'like' });
                  }}
                >
                  LIKE A CLUB
                </Button>
              ) : null}
            </ThemeProvider>
            <ThemeProvider theme={redTheme}>
              <Typography className={classes.subTitle} align="left" color="primary" variant="h4">
                Dislikes
              </Typography>
              {userReducer.dislikes.length ? (
                <Typography align="left" variant="subtitle1">
                  <div className={classes.favTeams}>
                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userReducer.dislikes.map(team => {
                            console.log(team);
                            return (
                              <TableRow key={team._id}>
                                <TableCell component="th" scope="row">
                                  {team.name}
                                </TableCell>
                                <TableCell>{team.country}</TableCell>
                                <TableCell align="right">
                                  <Button
                                    disabled={onHold}
                                    // autoFocus
                                    color="primary"
                                    // className={classes.deleteButton}
                                    // className={classes.headerLogoutButton}
                                    onClick={() => handleDeleteTeams(team, 'dislike')}
                                  >
                                    delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Typography>
              ) : (
                <Typography className={classes.text} align="left" variant="subtitle1">
                  You didn&rsquo;t add any club yet
                </Typography>
              )}

              {userReducer.dislikes.length < 5 ? (
                <Button
                  // onClick={handleClose}
                  // className={classes.addNewTeamBtn}
                  variant="contained"
                  color="primary"
                  // component={RedirectToLink}
                  // to="/teams/addnewteam"
                  style={{ marginRight: '10px' }}
                  onClick={() => {
                    setState({ ...state, addNewClubModal: 'dislike' });
                  }}
                >
                  DISLIKE A CLUB
                </Button>
              ) : null}
            </ThemeProvider>
          </div>
        </Grid>
        <Grid item xs={false} sm={2} md={3} />
      </Grid>

      {state.modalErrors.length ? (
        <ModalError errors={state.modalErrors} handleClose={onModalErrorClose} />
      ) : null}

      {state.addNewClubModal ? (
        <AddNewClub type={state.addNewClubModal} handleClose={onAddNewClubModalClose} />
      ) : null}
    </>
  );
}

// <div className={classes.formStyle}>
//   {/* <TableContainer component={Paper}>
//               <Table aria-label="simple table">
//                  <TableHead>
//             <TableRow>
//               <TableCell>Dessert (100g serving)</TableCell>
//               <TableCell align="right">Calories</TableCell>
//               <TableCell align="right">Fat&nbsp;(g)</TableCell>
//               <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//               <TableCell align="right">Protein&nbsp;(g)</TableCell>
//             </TableRow>
//           </TableHead>

//                  {rows.map(row => (
//             <TableRow key={row.name}>
//               <TableCell component="th" scope="row">
//                 {row.name}
//               </TableCell>
//               <TableCell align="right">{row.calories}</TableCell>
//               <TableCell align="right">{row.fat}</TableCell>
//               <TableCell align="right">{row.carbs}</TableCell>
//               <TableCell align="right">{row.protein}</TableCell>
//             </TableRow>
//           ))}
//               </Table>
//             </TableContainer> */}

//   {userReducer.likes.length || userReducer.dislikes.length ? (
//     <Typography variant="h5">
//                 choose your side
//       {/* <ThumbDownAltTwoToneIcon
//                 style={{ color: '#dd2c00', fontSize: 25, marginLeft: 10 }}
//               /> */}
//     </Typography>
//             ) : null}

//   {userReducer.likes.length ? (
//     <div className={classes.favTeams}>
//       <TableContainer component={Paper}>
//         <Table aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Country</TableCell>
//               <TableCell />
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {userReducer.likes.map(team => {
//                         console.log(team);
//                         return (
//                           <TableRow key={team._id}>
//                             <TableCell component="th" scope="row">
//                               {team.name}
//                             </TableCell>
//                             <TableCell>{team.country}</TableCell>
//                             <TableCell align="right">
//                               <Button
//                                 disabled={state.onHold}
//                                 // autoFocus
//                                 color="primary"
//                                 // className={classes.deleteButton}
//                                 // className={classes.headerLogoutButton}
//                                 onClick={() => handleDeleteTeams(team, 'like')}
//                               >
//                                 delete
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//             ) : null}

//   {userReducer.dislikes.length ? (
//     <div className={classes.favTeams}>
//       <TableContainer component={Paper}>
//         <Table aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Country</TableCell>
//               <TableCell />
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {userReducer.dislikes.map(team => {
//                         console.log(team);
//                         return (
//                           <TableRow key={team._id}>
//                             <TableCell component="th" scope="row">
//                               {team.name}
//                             </TableCell>
//                             <TableCell>{team.country}</TableCell>
//                             <TableCell align="right">
//                               <Button
//                                 disabled={state.onHold}
//                                 // autoFocus
//                                 color="primary"
//                                 // autoFocus
//                                 // color="secondary"
//                                 // className={classes.deleteButton}
//                                 // className={classes.headerLogoutButton}
//                                 onClick={() => handleDeleteTeams(team, 'dislike')}
//                               >
//                                 delete
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         );
//                       })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//             ) : null}

//   {/* {likesReducer.length < 5 ? ( */}
//   <div className={classes.groupBtn}>
//     <Button
//                 // onClick={handleClose}
//                 // className={classes.addNewTeamBtn}
//       variant="contained"
//       color="secondary"
//                 // component={RedirectToLink}
//                 // to="/teams/addnewteam"
//       style={{ marginRight: '10px' }}
//       onClick={() => {
//                   setState({ ...state, addNewClubModal: 'like' });
//                 }}
//     >
//                 add new team
//     </Button>
//     <Button
//                 // onClick={handleClose}
//                 // className={classes.addNewTeamBtn}
//                 // variant="contained"
//       color="secondary"
//       component={RedirectToLink}
//       to="/teams/offernewteam"
//     >
//                 offer a new team
//     </Button>
//   </div>
//   {/* ) : null} */}
//   {/* <Typography variant="h5" className={classes.titleIcon}>
//             Hated
//             <ThumbDownAltTwoToneIcon style={{ color: '#dd2c00', fontSize: 25, marginLeft: 10 }} />
//           </Typography> */}
// </div>
