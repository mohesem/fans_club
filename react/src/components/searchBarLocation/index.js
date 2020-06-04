import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {Platform, View, StyleSheet, Keyboard} from 'react-native';
import {Text, List, ListItem, Input, Item, Icon, Content} from 'native-base';

// API
import mapboxLocationSearch from '../../api/mapboxLocationSearch';

import IconReactNative from 'react-native-vector-icons/FontAwesome';
import {FontAwesomeIcon as IconReact} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import colors from '../../native-base-theme/colors';

export default props => {
  const Media = useSelector(global => global.media);
  const Center = useSelector(global => global.center);

  const [locationOptions, setLocationOptions] = useState([]);

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
      backgroundColor: '#ffffffbd',
      borderRadius: 32,
      padding: 8,
      maxWidth: Media !== 'sm' ? 'fit-content' : null,
    },
    searcBar: {
      flex: 1,
      flexDirection: 'row',
      flexGrow: 1,
      borderBottomWidth: 0,
    },
    locationSearchView: {
      flex: 1,
    },
    input: {
      flex: 1,
      height: 50,
      borderColor: colors.brandLightGray,
      borderWidth: 1,
      backgroundColor: 'white',
      borderRadius: 50,
      paddingRight: 20,
      paddingLeft: 20,
      width: Platform.OS === 'web' && Media === 'sm' ? 0 : null,
    },
    listItemText: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 'auto',
    },
    iconSearch: {
      position: 'absolute',
      right: 15,
    },
    item: {
      borderBottomWidth: 0,
      marginLeft: 0,
      marginTop: 4,
      padding: 10,
      paddingLeft: 20,
      backgroundColor: '#ffffffc9',
      borderRadius: 50,
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */
  const handleSearchInputChange = string => {
    if (string) {
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
          setLocationOptions(newOptions);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      setLocationOptions([]);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                  component                                 */
  /* -------------------------------------------------------------------------- */

  //   <Item>
  //   <Icon active name='home' />
  //   <Input placeholder='Icon Textbox'/>
  // </Item>

  const SearchIcon = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.iconSearch}>
          <IconReact icon={faSearch} color={colors.brandLightGray} />
        </View>
      );
    } else {
      // return (
      //   <View style={styles.iconSearch}>
      //     <IconReactNative
      //       name="map-marker-alt"
      //       size={25}
      //       color={colors.brandLightGray}
      //     />
      //   </View>
      // );

      return null;
    }
  };

  return (
    <View style={styles.parentView}>
      <Item style={styles.searcBar}>
        <SearchIcon />
        <Input
          placeholder="search for location"
          style={styles.input}
          onChangeText={handleSearchInputChange}
        />
      </Item>
      {locationOptions.length ? (
        <View style={styles.locationSearchView}>
          <List>
            {locationOptions.map(location => {
              return (
                <ListItem
                  style={styles.item}
                  key={location.name}
                  onPress={() => {
                    setLocationOptions([]);
                    props.handleFlyTo(location.center);
                    Keyboard.dismiss();
                  }}>
                  <Text style={styles.listItemText}>{location.name}</Text>
                </ListItem>
              );
            })}
          </List>
        </View>
      ) : null}
    </View>
  );
};
