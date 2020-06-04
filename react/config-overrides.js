const path = require('path');
const {
  override,
  addWebpackAlias,
  babelInclude,
  addBabelPlugins,
  addBabelPresets,
} = require('customize-cra');

// TODO: add url-loader for react-native-vector-icons web

module.exports = override(
  addWebpackAlias({
    'react-native/Libraries/Renderer/shims/ReactNativePropRegistry':
      'react-native-web/dist/modules/ReactNativePropRegistry',
    'react-native': 'react-native-web',
  }),
  babelInclude([
    path.resolve('src'),
    path.resolve('node_modules/native-base-shoutem-theme'),
    path.resolve('node_modules/react-navigation'),
    path.resolve('node_modules/react-native-easy-grid'),
    path.resolve('node_modules/react-native-drawer'),
    path.resolve('node_modules/react-native-safe-area-view'),
    path.resolve('node_modules/react-native-vector-icons'),
    path.resolve('node_modules/react-native-keyboard-aware-scroll-view'),
    path.resolve('node_modules/react-native-web'),
    path.resolve('node_modules/react-native-tab-view'),
    path.resolve('node_modules/static-container'),
    path.resolve('node_modules/react-native-gesture-handler'),
    path.resolve('node_modules/@react-native-mapbox-gl'),
    // path.resolve('node_modules/react-native-vector-icons'),
  ]),
  ...addBabelPlugins('@babel/plugin-proposal-class-properties'),
  ...addBabelPresets(
    '@babel/preset-env',
    '@babel/preset-flow',
    '@babel/preset-react',
  ),
);
