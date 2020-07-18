import { createMuiTheme } from '@material-ui/core/styles';
import { indigo, amber,pink } from '@material-ui/core/colors';

export const themeStyle = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: amber,
    error: pink,
  }
});