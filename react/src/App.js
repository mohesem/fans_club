import 'react-native-gesture-handler';

import React, {useState, useEffect} from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from './redux/reducers';
import * as Font from 'expo-font';

import MediaHlper from './components/helpers/Media';

import {Container, StyleProvider, Text, Root} from 'native-base';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/commonColor';

import AppProvider from './AppProvider';
const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // (async () => {
    //   await Font.loadAsync({
    //     irsans: require('./assets/fonts/IRANSans.ttf'),
    //   });
    // })();
    setIsReady(true);
  }, []);

  return (
    <>
      {isReady ? (
        <Provider store={store}>
          <Root>
            <MediaHlper />
            <StyleProvider style={getTheme(material)}>
              <Container>
                <AppProvider />
              </Container>
            </StyleProvider>
          </Root>
        </Provider>
      ) : (
        <Text>wait</Text>
      )}
    </>
  );
};
