import { createMuiTheme } from '@material-ui/core/styles';
import { indigo, amber, pink } from '@material-ui/core/colors';

const primaryMain = '#403A3E';
const secondaryMain = '#5894be';

export const themeStyle = createMuiTheme({
  palette: {
    primary: {
      main: primaryMain
    },
    secondary: {
      // BE5869, fab52e, 403A3E
      main: secondaryMain
    },
    error: pink,
  },
  gradientContained: `linear-gradient(45deg, ${primaryMain} 40%, ${secondaryMain} 100%)`
  // overrides: {
  //   MuiButton: {
  //     containedPrimary: {
  //       background: 'linear-gradient(45deg, #403A3E 30%, #5894be 100%)',
  //       color: 'white',
  //     }
  //   }
  // }
});