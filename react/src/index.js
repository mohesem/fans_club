import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.log(Platform.OS);

if (Platform.OS === 'web') {
  AppRegistry.registerComponent('App', () => App);

  AppRegistry.runApplication('App', {
    rootTag: document.getElementById('root'),
  });
} else {
  AppRegistry.registerComponent(appName, () => App);
}
