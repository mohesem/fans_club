import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: '#d32f2f',
      main: '#263238',
      dark: '#12181b',
      contrastText: '#fff',
    },
    secondary: {
      // light: '#26a69a',
      main: '#4caf50',
      // dark: '#00897b',
      contrastText: '#fff',
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
    warning: {
      light: '#ffb74d',
      main: '#ff9800',
      dark: '#f57c00',
      // contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      light: '#2196F3',
      main: '#2196f3',
      dark: '#2196F3',
      contrastText: '#fff',
    },
    success: {
      light: '#81c784',
      main: '#4caf50',
      dark: '#388e3c',
      // contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#d5d5d5',
      A200: '#aaaaaa',
      A400: '#303030',
      A700: '#616161',
    },
    background: {
      default: '#e6e6fa',
    },
  },
});

export default theme;
