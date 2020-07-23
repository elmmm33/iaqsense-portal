import { createMuiTheme } from '@material-ui/core/styles';
import { indigo, amber,pink } from '@material-ui/core/colors';

export const themeStyle = createMuiTheme({
  palette: {
    primary: {
      main: '#403A3E' 
    },
    secondary: {
      main: '#5894be'
    },
    error: pink,
  },
  // overrides:{
  //   MuiButton:{
  //     contained:{
  //       background: 'linear-gradient(45deg, #403A3E 30%, #BE5869 100%)',
  //       color: 'white',
  //     }
  //   }
  // }
});