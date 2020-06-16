import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import colors from '../../native-base-theme/colors';
import {useHistory} from '../../router';
import {Platform, View, TextInput, StyleSheet} from 'react-native';
import {Button, Text, List, ListItem} from 'native-base';

import IconReactNative from 'react-native-vector-icons/FontAwesome5';
import {FontAwesomeIcon as IconReact} from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faThumbsDown,
  faFutbol,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';

// API
import mapboxLocationSearch from '../../api/mapboxLocationSearch';
import searchClubsApi from '../../api/searchClubs';

export default props => {
  const Media = useSelector(global => global.media);
  const Center = useSelector(global => global.center);
  const history = useHistory();
  const [results, setResults] = useState([]);

  /* -------------------------------------------------------------------------- */
  /*                                   styles                                   */
  /* -------------------------------------------------------------------------- */
  const styles = StyleSheet.create({
    parentView: {
      position: 'absolute',
      right: 10,
      left: 10,
      top: 65,
      zIndex: 200,
      backgroundColor: '#ffffffed',
      borderRadius: 20,
      padding: 5,
      maxWidth: Media !== 'sm' ? 'fit-content' : null,
    },
    searcBar: {
      flex: 1,
      flexDirection: 'row',
    },
    locationSearchView: {
      // zIndex: 200,
      flex: 1,
      // borderRadius: 20,
      // backgroundColor: '#ffffffed',
      // position: 'absolute',
      // top: 125,
      // right: 10,
      // left: 10,
    },
    button: {
      borderRadius: 50,
      width: 40,
      height: 40,
      margin: 5,
      justifyContent: 'center',
    },
    activeButton: {
      borderRadius: 50,
      width: 40,
      height: 40,
      margin: 5,
      justifyContent: 'center',
      backgroundColor: '#263238',
    },
    incativeButton: {
      borderRadius: 50,
      width: 40,
      height: 40,
      margin: 5,
      justifyContent: 'center',
      backgroundColor: '#bdbdbd82',
    },
    input: {
      flex: 1,
      height: 50,
      borderColor: 'gray',
      borderWidth: 1,
      backgroundColor: 'white',
      borderRadius: 60,
      paddingRight: 20,
      paddingLeft: 20,
      width: Platform.OS === 'web' && Media === 'sm' ? 0 : null,
      marginHorizontal: 5,
    },
    listItemText: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 'auto',
    },
    listItemCountry: {
      // flexGrow: 1,
      // flexShrink: 1,
      flexBasis: 'auto',
      marginLeft: 10,
      fontSize: 12,
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */
  const handleSearchInputChange = string => {
    if (string) {
      if (props.searchMode === 'loc') {
        mapboxLocationSearch(string, Center)
          .then(res => {
            const {features} = res.data;
            // console.log('new options are :: ', fs);

            const newOptions = features.map(f => {
              // console.log(f);
              if (f.bbox) {
                return {name: f.place_name, center: f.bbox};
              }
              return {name: f.place_name, center: f.center};
            });
            setResults(newOptions);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        searchClubsApi(string).then(res => {
          setResults(res.data.clubs);
        });
      }
    } else {
      setResults([]);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   effects                                  */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                  component                                 */
  /* -------------------------------------------------------------------------- */
  const LikeIcon = () => {
    if (Platform.OS === 'web') {
      return <IconReact icon={faThumbsUp} color="white" />;
    }
    return <IconReactNative name="thumbs-up" size={25} color="white" />;
  };

  const DislikeIcon = () => {
    if (Platform.OS === 'web') {
      return <IconReact icon={faThumbsDown} color="white" />;
    }
    return <IconReactNative name="thumbs-down" size={25} color="white" />;
  };

  const BallIcon = () => {
    if (Platform.OS === 'web') {
      return (
        <IconReact
          icon={faFutbol}
          color={props.searchMode === 'team' ? colors.brandLight : '#263238'}
        />
      );
    }
    return (
      <IconReactNative
        name="futbol"
        size={25}
        color={props.searchMode === 'team' ? colors.brandLight : '#263238'}
      />
    );
  };

  const MapMarkerIcon = () => {
    if (Platform.OS === 'web') {
      return (
        <IconReact icon={faMapMarkerAlt} color={props.searchMode === 'loc' ? 'white' : '#263238'} />
      );
    }
    return (
      <IconReactNative
        name="map-marker-alt"
        size={25}
        color={props.searchMode === 'loc' ? 'white' : '#263238'}
      />
    );
  };

  const LikeOrDislikeBtn =
    props.likeOrDislike === 'like' ? (
      <Button iconCenter style={styles.button} onPress={props.handleLikeOrDislike}>
        <LikeIcon />
      </Button>
    ) : (
      <Button iconCenter style={styles.button} danger onPress={props.handleLikeOrDislike}>
        <DislikeIcon />
      </Button>
    );

  return (
    <View style={styles.parentView}>
      <View style={styles.searcBar}>
        {props.searchMode === 'team' ? LikeOrDislikeBtn : null}
        <TextInput style={styles.input} onChangeText={handleSearchInputChange} />
        <Button
          iconCenter
          style={props.searchMode === 'team' ? styles.activeButton : styles.incativeButton}
          onPress={() => props.handleSearchMode('team')}>
          <BallIcon />
        </Button>
        <Button
          iconCenter
          style={props.searchMode === 'loc' ? styles.activeButton : styles.incativeButton}
          onPress={() => props.handleSearchMode('loc')}>
          <MapMarkerIcon />
        </Button>
      </View>
      {results.length ? (
        <View style={styles.locationSearchView}>
          <List>
            {props.searchMode === 'loc'
              ? results.map(location => {
                  return (
                    <ListItem
                      key={location.name}
                      onPress={() => {
                        setResults([]);
                        props.handleFlyTo(location.center);
                      }}>
                      <Text style={styles.listItemText}>{location.name}</Text>
                    </ListItem>
                  );
                })
              : results.map(club => {
                  return (
                    <ListItem
                      key={club._id}
                      onPress={() => {
                        setResults([]);
                        console.log(club);
                        history.push(`/map/${props.likeOrDislike}/${club._id}`);
                        // props.handleFlyTo(location.center);
                      }}>
                      <Text style={styles.listItemCountry}>{club.country}</Text>
                      <Text style={styles.listItemText}>{club.name}</Text>
                    </ListItem>
                  );
                })}
          </List>
        </View>
      ) : null}
    </View>
  );
};
