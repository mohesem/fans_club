import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Platform, AsyncStorage} from 'react-native';
import {Router} from './router';
import Routes from './routes';

// components
import Header from './components/header';
import DrawerWeb from './components/drawer/web';
import DrawerMobile from './components/drawer/mobile';

import {isUserAction, userAction} from './redux/actions';

// api
import getUserInfoApi from './api/getUserInfo';

export default () => {
  const dispatch = useDispatch();

  const mediaReducer = useSelector(global => global.media);
  const isUserReducer = useSelector(global => global.isUser);

  // const [isReady, setIsReady] = useState(false);

  const [dummyNumber, setDummyNumber] = useState(0);

  const handleWebMenuOpen = () => {
    setDummyNumber(dummyNumber + 1);
  };

  const checkUser = token => {
    console.log(token);
    getUserInfoApi(token)
      .then(res => {
        // console.log('------------------***--------------', res);
        dispatch(isUserAction(true));
        const user = {
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          thumbnail: res.data.thumbnail,
          location: res.data.location,
          likes: res.data.likes,
          dislikes: res.data.dislikes,
        };
        // console.log('*****&&&', user);
        dispatch(userAction(user));
      })
      .catch(err => {
        console.log(err);
        dispatch(isUserAction(false));
      });
  };

  if (isUserReducer === null) {
    if (Platform.OS === 'web') {
      if (localStorage['fans-club']) {
        const token = localStorage['fans-club'];
        checkUser(token);
      } else {
        dispatch(isUserAction(false));
      }
    } else {
      console.log('platform is IOS or Android');
      (async () => {
        const token = await AsyncStorage.getItem('fans-club');
        console.log('TokTokTokTok ::: ', token);
        checkUser(token);
      })();
    }
  }

  // console.log('isUser ::::: ', isUserReducer);

  return (
    <Router>
      {Platform.OS !== 'web' ? (
        <DrawerMobile />
      ) : (
        <>
          {mediaReducer === 'lg' ? (
            <Router>
              <Header />
              <Routes />
            </Router>
          ) : (
            <>
              <Routes />
              <DrawerWeb dummyNumber={dummyNumber} />
              <Header handleWebMenuOpen={handleWebMenuOpen} />
            </>
          )}
        </>
      )}
    </Router>
  );
};

// {isUserReducer !== null ? (
//         <>
//           {mediaReducer === 'lg' ? (
//             <Router>
//               <Header />
//               <Routes />
//             </Router>
//           ) : (
//             <Router>
//               {Platform.OS !== 'web' ? (
//                 <>
//                   <DrawerMobile />
//                 </>
//               ) : (
//                 <>
//                   <DrawerWeb dummyNumber={dummyNumber} />
//                   <Header handleWebMenuOpen={handleWebMenuOpen} />
//                   <Routes />
//                 </>
//               )}
//             </Router>
//           )}
//         </>
//       ) : null}
