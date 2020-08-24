import React from 'react';
import {Switch, Route, Redirect} from '../router/index';

import HomeScreen from '../screens/Home';
import SignupScreen from '../screens/Signup';
import SigninScreen from '../screens/Signin';
import ClubsScreen from '../screens/Clubs';
import GetUserLocationScreen from '../screens/GetUserLocation';
import ChangeUserLocationScreen from '../screens/ChangeUserLocation';

export default () => {
  return (
    <Switch>
      {/* <Route exact path="/">
        <Redirect to="/map" />
      </Route> */}
      <Route
        exact
        path={['/', '/map', '/map/:likeOrDislike', '/map/:likeOrDislike/:id']}
        component={HomeScreen}
      />
      <Route exact path="/signup" component={SignupScreen} />
      <Route exact path="/signin" component={SigninScreen} />
      <Route exact path="/clubs" component={ClubsScreen} />
      <Route exact path="/getUserLocation" component={GetUserLocationScreen} />
      <Route exact path="/changeUserLocation" component={ChangeUserLocationScreen} />
    </Switch>
  );
};
