import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Paper, FormControl, FormHelperText, Dialog, TextField, Grid, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

import envars from '../../envars';
import api, { handleApiFailureWithDialog } from '../../utils/api';

import { withSnackbar } from '../../containers/SnackbarManager/SnackbarManager';
import { withDialog } from '../../containers/DialogManager/DialogManager';

const DeviceLocationEditDialog = props => {
  const { device, open, onBeforeCloseHandler } = props;

  const [error, setError] = useState(null);
  const [location, setLocation] = useState(device.location);

  const onSaveButtonHandler = async () => {
    if (!location || location === '') {
      setError('Please Input the Location.')
      return;
    }

    let updateLocationApiResult = await api('post', `${envars.deviceServiceUrl}/update/${device.deviceId}/location`, { location });
    if (updateLocationApiResult.data.success) {
      props.makeSnackbar('Device Location Updated')
      let updatedDevice = updateLocationApiResult.data.result.device;
      onBeforeCloseHandler(updatedDevice);
    } else {
      handleApiFailureWithDialog(props.requestDialog, updateLocationApiResult);
    }
  }

  return (
    <Dialog open={open} onClose={() => { onBeforeCloseHandler() }}>
      <div className="edit-dialog paper-with_padding">
        <Grid>
          <Grid item>
            <FormControl margin="normal" fullWidth required>
              <TextField
                id="deviceLocation"
                label="Edit Device Location"
                value={location}
                onChange={(e) => {
                  setError(null);
                  setLocation(e.target.value);
                }}
                InputLabelProps={{
                  shrink: true
                }}
                error={error ? true : false}
                helpertext={error ? error : null}
              />
              {/* <FormHelperText id="errorName" required error={error ? true : false} style={{ display: 'none' }}>
            Please Input Creative Name
          </FormHelperText> */}
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="flex-end" alignItems="center" spacing={2}>
          <Grid item>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={onSaveButtonHandler}
            >
              <SaveIcon />
                Save
              </Button>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
}

const mapStateToProps = state => {
  return {
    user: state.system.user
  };
};

export default connect(mapStateToProps, null)(withDialog(withSnackbar(DeviceLocationEditDialog)));