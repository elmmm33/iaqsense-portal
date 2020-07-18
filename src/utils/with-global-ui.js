import { withDialog } from '../containers/DialogManager/DialogManager';
import { withSnackbar } from '../containers/SnackbarManager/SnackbarManager';

const withGlobalUI = component => {
  return withDialog(withSnackbar(component));
};

export default withGlobalUI;
