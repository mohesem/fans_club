import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from '../router';
import {ImageBackground, StyleSheet, ScrollView, Platform, AsyncStorage} from 'react-native';
import {Grid, Col, H3, ListItem, View, Form, Text, Spinner, Button, List} from 'native-base';
import {FontAwesomeIcon as IconReact} from '@fortawesome/react-fontawesome';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import MyInput from '../myTheme/components/input';
import IconReactNative from 'react-native-vector-icons/FontAwesome';

// api
import searchClubsApi from '../api/searchClubs';
import likeClubApi from '../api/likeClub';
import dislikeClubApi from '../api/dislikeClub';
import deleteClubApi from '../api/deleteClub';

import colors from '../myTheme/colors';
import {userAction} from '../redux/actions';

const styles = StyleSheet.create({
  imageBackParent: {
    height: 500,
    flex: 1,

    backgroundColor: 'red',
  },
  imageBack: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    zIndex: 1,
    position: 'absolute',
    top: 56,
    bottom: 0,
    left: 0,
    right: 0,
  },
  formCol: {
    // padding: 20,
  },
  viewCol: {
    backgroundColor: '#ecececf0',
    padding: 20,
    paddingBottom: 50,
    flexDirection: 'column',
    flexGrow: 1,
  },
  formLayoutParent: {
    position: 'absolute',
    top: 56,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    overflow: Platform.OS === 'web' ? 'auto' : null,
  },
  form: {
    maxWidth: 400,
    alignSelf: 'stretch',
    width: Platform.OS === 'web' ? '100%' : null,
    margin: 'auto',
  },
  title: {
    marginBottom: 10,
    marginTop: 10,
    fontWeight: 'bold',
  },
  titleDislike: {
    marginBottom: 10,
    marginTop: 30,
    fontWeight: 'bold',
  },
  // #################
  fullScreenModal: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: colors.bws7,
    zIndex: 100,
  },
  searchView: {
    flexDirection: 'row',
    flexGrow: 1,
    borderBottomWidth: 0,
    maxWidth: 500,
  },

  iconSearch: {position: 'absolute', right: 20, top: 20},
  itemsScrollView: {
    position: 'absolute',
    left: 0,
    top: 90,
    bottom: 65,
    right: 0,
  },
  listItems: {
    borderBottomWidth: 1,
    backgroundColor: colors.bws6,
    // maxWidth: 500,
    // width: 300,
    alignSelf: 'center',
    marginLeft: 0,
    paddingLeft: 10,
    width: Platform.OS === 'web' ? '100%' : null,
  },
  listText: {
    alignSelf: 'center',
    flexDirection: 'row',
    textAlign: 'center',
    flexGrow: 1,
  },
  fullScreenModalFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'white',
    // maxWidth: 500,
  },
  closeButton: {
    width: Platform.OS === 'web' ? 300 : null,
    alignSelf: 'center',
  },
  // ########
  clubsListItem: {
    flexDirection: Platform.OS === 'web' ? 'row-reverse' : 'row',
  },
  clubsListItemWeb: {
    flexDirection: Platform.OS === 'web' ? 'row-reverse' : 'row',
    cursor: 'default',
  },
  clubDeleteBtn: {
    position: 'absolute',
    right: 10,
    paddingTop: 0,
    paddingBottom: 0,
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  countryNameText: {marginRight: 15, fontSize: 12, color: colors.bws3},
  clubNameText: {},
  clubNameBtn: {
    paddingTop: 0,
    paddingBottom: 0,
    height: 35,
  },
  deleteOnHoldSpinners: {
    position: 'absolute',
    right: 10,
  },
  likeANewClubBtn: {marginTop: 20},
});

const searchInputStyle = {
  paddingLeft: 30,
  padding: 10,
  height: 50,
  borderRadius: 50,
  borderBottomWidth: 2,
  borderTopWidth: 2,
  borderRightWidth: 2,
  borderLeftWidth: 2,
  borderColor: colors.brandPrimary,
  fontSize: 18,
  flexGrow: 1,
  backgroundColor: colors.brandLight,
};

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const mediaReducer = useSelector(global => global.media);
  const userReducer = useSelector(global => global.user);

  const [deleteOnHold, setDeleteOnHold] = useState(false);
  const [likeOrDislike, setLikeOrDislike] = useState(0);
  const [fullScreenModalVisibility, seFullScreenModalVisibility] = useState(false);

  const FullScreenPage = () => {
    const [value, setValue] = useState('');
    const [results, setResults] = useState([]);
    const [onHold, setOnHold] = useState(false);
    // test
    useEffect(() => {
      if (value) {
        searchClubsApi(value)
          .then(res => {
            console.log('**77^^^^', res);
            setResults(res.data.clubs);
          })
          .catch(err => console.log(err));
      }
    }, [value]);

    return (
      <View padder style={styles.fullScreenModal}>
        {!onHold ? (
          <>
            <View style={styles.searchView}>
              <MyInput
                value={value}
                onChangeText={str => setValue(str)}
                placeholder="club name"
                userStyle={searchInputStyle}
              />
              <IconReactNative
                name="search"
                size={25}
                color={colors.brandPrimary}
                style={styles.iconSearch}
              />
            </View>
            <ScrollView style={styles.itemsScrollView}>
              {results.map(club => {
                return (
                  <ListItem
                    // key={location.name}
                    style={styles.listItems}
                    onPress={async () => {
                      console.log('press');
                      const getToken = () => {
                        return new Promise(async resolve => {
                          if (Platform.OS === 'web') {
                            const t = localStorage.getItem('fans-club');
                            resolve(t);
                          } else {
                            const t = await AsyncStorage.getItem('fans-club');
                            resolve(t);
                          }
                        });
                      };

                      const token = await getToken();
                      console.log('TTTTTTTTTT', token);
                      setOnHold(true);
                      if (likeOrDislike === 1) {
                        likeClubApi(club, token).then(res => {
                          seFullScreenModalVisibility(false);
                          console.log('rrrrrrrrrrrrrrrr', res);
                          dispatch(
                            userAction({
                              firstname: res.data.firstname,
                              lastname: res.data.lastname,
                              likes: res.data.likes,
                              dislikes: res.data.dislikes,
                              suggests: res.data.suggests,
                              location: res.data.location,
                            }),
                          );
                        });
                      } else if (likeOrDislike === 2) {
                        dislikeClubApi(club, token).then(res => {
                          seFullScreenModalVisibility(false);
                          console.log('rrrrrrrrrrrrrrrr', res);
                          dispatch(
                            userAction({
                              firstname: res.data.firstname,
                              lastname: res.data.lastname,
                              likes: res.data.likes,
                              dislikes: res.data.dislikes,
                              suggests: res.data.suggests,
                              location: res.data.location,
                            }),
                          );
                        });
                      }
                    }}>
                    <Text style={styles.listText}>{club.name}</Text>
                  </ListItem>
                );
              })}
            </ScrollView>
            <View style={styles.fullScreenModalFooter}>
              <Button
                danger
                block
                style={styles.closeButton}
                onPress={() => seFullScreenModalVisibility(false)}>
                <Text>close</Text>
              </Button>
            </View>
          </>
        ) : (
          <Spinner />
        )}
      </View>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */

  const openModal = num => {
    seFullScreenModalVisibility(true);
    setLikeOrDislike(num);
  };

  const handleDeleteClub = async (club, type) => {
    setDeleteOnHold(true);
    const getToken = () => {
      return new Promise(async resolve => {
        if (Platform.OS === 'web') {
          const t = localStorage.getItem('fans-club');
          resolve(t);
        } else {
          const t = await AsyncStorage.getItem('fans-club');
          resolve(t);
        }
      });
    };

    const token = await getToken();

    deleteClubApi(club, type, token)
      .then(res => {
        setDeleteOnHold(false);
        dispatch(
          userAction({
            firstname: res.data.firstname,
            lastname: res.data.lastname,
            likes: res.data.likes,
            dislikes: res.data.dislikes,
            suggests: res.data.suggests,
            location: res.data.location,
          }),
        );
      })
      .catch(err => {
        console.log('eeeeeeeeeeee', err);
        setDeleteOnHold(false);
      });
  };

  /* -------------------------------------------------------------------------- */
  /*                                 components                                 */
  /* -------------------------------------------------------------------------- */

  const ClubsForm = () => {
    return (
      <Form style={styles.form}>
        <H3 style={styles.title}>LIKES</H3>
        {!userReducer.likes?.length ? (
          <Text>you added no clubs yet</Text>
        ) : (
          <List>
            {userReducer.likes.map(club => {
              return (
                <ListItem
                  key={club._id}
                  style={Platform.OS === 'web' ? styles.clubsListItemWeb : styles.clubsListItem}>
                  <Button
                    transparent
                    style={styles.clubNameBtn}
                    onPress={() => history.push(`/map/like/${club._id}`)}>
                    <Text style={styles.clubNameText}>{club.name}</Text>
                  </Button>
                  <Text style={styles.countryNameText}>{club.country}</Text>

                  {!deleteOnHold ? (
                    <Button
                      transparent
                      style={styles.clubDeleteBtn}
                      onPress={() => handleDeleteClub(club, 'like')}>
                      {Platform.OS !== 'web' ? (
                        <IconReactNative name="times-circle" size={20} color={colors.brandDanger} />
                      ) : (
                        <IconReact icon={faTimesCircle} color={colors.brandDanger} />
                      )}
                    </Button>
                  ) : (
                    <Spinner style={styles.deleteOnHoldSpinners} />
                  )}
                </ListItem>
              );
            })}
          </List>
        )}
        {userReducer.likes?.length < 5 ? (
          <Button sm style={styles.likeANewClubBtn} onPress={() => openModal(1)}>
            <Text>like new club</Text>
          </Button>
        ) : null}

        <H3 style={styles.titleDislike}>DISLIKES</H3>
        {!userReducer.dislikes?.length ? (
          <Text>you added no clubs yet</Text>
        ) : (
          <List>
            {userReducer.dislikes.map(club => {
              return (
                <ListItem key={club._id} style={styles.clubsListItem}>
                  <Text style={styles.clubNameText}>{club.name}</Text>
                  <Text style={styles.countryNameText}>{club.country}</Text>

                  {!deleteOnHold ? (
                    <Button
                      transparent
                      style={styles.clubDeleteBtn}
                      onPress={() => handleDeleteClub(club, 'dislike')}>
                      <IconReactNative name="times-circle" size={20} color={colors.brandDanger} />
                    </Button>
                  ) : (
                    <Spinner style={styles.deleteOnHoldSpinners} />
                  )}
                </ListItem>
              );
            })}
          </List>
        )}
        {Object.keys(userReducer).length && !userReducer.dislikes.length ? (
          <Button sm onPress={() => openModal(2)}>
            <Text>dislike a club</Text>
          </Button>
        ) : null}
      </Form>
    );
  };

  return (
    <>
      {mediaReducer === 'lg' ? (
        <>
          <ImageBackground source={require('../assets/img/3.jpeg')} style={styles.imageBack} />
          <Grid style={styles.formLayoutParent}>
            <Col size={1} />
            <Col size={2} style={styles.formCol}>
              <View style={styles.viewCol}>
                <ClubsForm />
              </View>
            </Col>
            <Col size={1} />
          </Grid>
        </>
      ) : (
        <>
          <ImageBackground source={require('../assets/img/3.jpeg')} style={styles.imageBack} />
          <Grid padder style={styles.formLayoutParent}>
            <Col size={2} style={styles.formCol}>
              <View style={styles.viewCol}>
                <ScrollView>
                  <ClubsForm />
                </ScrollView>
              </View>
            </Col>
          </Grid>
        </>
      )}
      {fullScreenModalVisibility ? <FullScreenPage /> : null}
    </>
  );
};
