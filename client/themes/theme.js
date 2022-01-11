import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Create a theme instance.
let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7547DC',
    },
    secondary: {
      main: '#303030',
    },
    background: {
      default: '#000',
    },
    text: {
      primary: '#FFF'
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
  }
});

theme = responsiveFontSizes(theme);

export default theme;