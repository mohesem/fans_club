// react
import React from 'react';
import ReactDOM from 'react-dom';
// redux
import { createStore } from 'redux';
import { Provider } from 'react-redux';
// routers
import { Route, BrowserRouter as Router } from 'react-router-dom';
// snack
import { SnackbarProvider } from 'notistack';
// material-ui components
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
// service workers && reducers && theme
import * as serviceWorker from './serviceWorker';
import reducers from './reducers';
import theme from './themes/main';
// CSS
import './css/main.css';
// components
import Appbar from './components/appbar';
import Map from './components/map';
import Signup from './components/signup';
import Signin from './components/signin';
import Clubs from './components/clubs';
import Search from './components/search';

// creating store
const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider>
      <Router>
        <ThemeProvider theme={theme}>
          <Route path="/" component={Map} />
          <Route path="/" component={Appbar} />
          <Route exact path={['/', '/v', '/v/:id', '/signup/getUserLocation']} component={Search} />
          <Route exact path="/signup" component={Signup} />

          <Route exact path="/signin" component={Signin} />
          <Route exact path="/clubs" component={Clubs} />

          <CssBaseline />
        </ThemeProvider>
      </Router>
    </SnackbarProvider>
  </Provider>,
  document.querySelector('#root')
);

serviceWorker.unregister();
