import React, {useState, useEffect} from 'react';
import {Platform} from 'react-native';
import {withRouter} from '../router';
import SearchBar from '../components/searchBar';
import axios from 'axios';
import {useHistory} from '../router';

import Map from '../components/map';
// import searchBar from '../components/searchBar';

const Home = props => {
  const history = useHistory();

  const [likeOrDislike, setLikeOrDislike] = useState('like');
  const [searchMode, setSearchMode] = useState('team');
  const [flyTo, setFlyTo] = useState([]);
  const [flyToClub, setFlyToClub] = useState([]);
  const [clubId, setClubId] = useState('');
  const [clubDetail, setClubDetail] = useState({});
  const [pathname, setPathname] = useState('');

  const {location} = props;
  const _pathname = location.pathname;
  if (_pathname !== pathname) {
    setPathname(_pathname);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  handlers                                  */
  /* -------------------------------------------------------------------------- */
  const handleLikeOrDislike = () => {
    const pathnameArray = pathname.split('/');
    const newValue = () => {
      if (pathnameArray[2] === 'like') {
        return 'dislike';
      }
      return 'like';
    };

    pathnameArray.splice(2, 1, newValue());
    const newAddress = pathnameArray.join('/');
    console.log(newAddress);
    history.push(newAddress);
  };

  const handleSearchMode = mode => {
    if (mode !== searchMode) {
      setSearchMode(mode);
    }
  };

  const handleFlyTo = center => {
    console.log(center);
    setFlyTo(center);
  };

  const handleFlyToClub = center => {
    setFlyToClub(center);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   effects                                  */
  /* -------------------------------------------------------------------------- */
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', clubId);

  useEffect(() => {
    const pathnameArray = pathname.split('/');

    // set like or dislike
    if (pathnameArray[2] && pathnameArray[2] !== likeOrDislike) {
      setLikeOrDislike(pathnameArray[2]);
    }
    // set club id if there is one
    console.log('----____--_---_-__-___--_-', pathnameArray[3], '::::', clubId);
    if (pathnameArray[3] && pathnameArray[3] !== clubId) {
      console.log('*************************************************************************');
      setClubId(pathnameArray[3]);
    } else if (!pathnameArray[3]) {
      setClubId('');
    }
  }, [clubId, likeOrDislike, pathname]);

  useEffect(() => {
    const pathnameArray = pathname.split('/');

    if (pathnameArray[3] && clubId !== pathnameArray[3]) {
      console.log(':::::::::::::::::::::::::::::::::::::::::::::::::::::');
      axios
        .get(`https://www.fansclub.app/api/v1/GET/club/${pathnameArray[3]}`)
        .then(res => {
          console.log('res is is is is ::', res);
          handleFlyToClub(res.data.city?.geo?.coordinates || undefined);
          setClubDetail({
            cityName: res.data.city || res.data.city.name,
            countyName: res.data.country || res.data.city.country,
            cityCoords: res.data.city?.geo?.coordinates || null,
            clubGroup: res.data.group || res.data.club.group,
            clubName: res.data.name || res.data.club.name,
            primaryColor: res.data.primary_color || res.data.club.primary_color,
            secondaryColor: res.data.secondary_color || res.data.club.secondary_color,
            logoBase64: res.data.base64Image || null,
          });
        })
        .catch(err => {
          console.log('err is  : ::: ', err);
        });
    } else {
      // TODO: clear logo if exist
    }
  }, [clubId, pathname]);

  /* -------------------------------------------------------------------------- */
  /*                                    props                                   */
  /* -------------------------------------------------------------------------- */
  const searchBarProps = {
    likeOrDislike,
    handleLikeOrDislike,
    searchMode,
    handleSearchMode,
    handleFlyTo,
    pathname,
  };

  const mapProps = {
    likeOrDislike,
    flyTo,
    flyToClub,
    handleFlyTo,
    clubDetail,
    clubId,
  };

  /* -------------------------------------------------------------------------- */
  /*                                  component                                 */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      {Platform.OS !== 'web' ? (
        <>
          <SearchBar {...searchBarProps} />
          <Map {...mapProps} />
        </>
      ) : (
        <>
          <SearchBar {...searchBarProps} />
          <Map {...mapProps} />
        </>
      )}
    </>
  );
};

export default withRouter(Home);
