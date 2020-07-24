import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Drawer, Grid, Paper, Typography, FormControl, TextField, InputLabel, Button, Select, MenuItem } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

import envars from '../../envars';
import api, { handleApiFailureWithDialog } from '../../utils/api';
import toHKTimeString from '../../utils/to-hk-time-string';

import { withSnackbar } from '../../containers/SnackbarManager/SnackbarManager';
import { withDialog } from '../../containers/DialogManager/DialogManager';

const DeviceConfigDrawer = props => {
  const { device, editingConfig, onBeforeCloseHandler } = props;
  const [error, setError] = useState({ key: null, msg: null });
  const [continueOn, setContinueOn] = useState(device.continueOn);
  const [instantOn, setInstantOn] = useState(device.instantOn);
  const [onTime, setOnTime] = useState(device.onTime);
  const [offTime, setOffTime] = useState(device.offTime);

  const onSaveButtonHandler = async () => {
    if (onTime > 59 || onTime <= 0) {
      setError({ 'key': 'onTime', 'msg': 'On Time need to between 1-59' });
      return;
    }
    if (offTime > 59 || offTime <= 0) {
      setError({ 'key': 'offTime', 'msg': 'Off Time need to between 1-59' });
      return;
    }

    const deviceConfig = {
      continueOn,
      instantOn,
      onTime,
      offTime
    }

    let invalidField = false;
    Object.keys(deviceConfig).forEach(config => {
      if (deviceConfig[config] === '' || deviceConfig[config] === null) {
        setError({ 'key': config, 'msg': `Please Input ${config}` });
        invalidField = true;
      }
    })
    if (invalidField) {
      return;
    }

    setError({ key: null, msg: null });

    let updateConfigApiResult = await api('post', `${envars.deviceServiceUrl}/update/${device.deviceId}/config`, deviceConfig);
    if (updateConfigApiResult.data.success) {
      props.makeSnackbar('Device Config Updated')
      let updatedDevice = updateConfigApiResult.data.result.device;
      onBeforeCloseHandler(updatedDevice);
    } else {
      handleApiFailureWithDialog(props.requestDialog, updateConfigApiResult);
    }


  }

  return (
    <Drawer anchor="right" open={editingConfig} onClose={() => { onBeforeCloseHandler() }}>
      <Paper className="drawer-on-right paper-with-padding">
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="h5">Device Config</Typography>
          </Grid>
          <Grid item>
            <Paper className="paper-with-padding">
              <Typography variant="h6" gutterBottom>
                Update
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <FormControl required fullWidth>
                    <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                      Continue On
                    </InputLabel>
                    <Select
                      value={continueOn}
                      onChange={(e) => { setContinueOn(e.target.value) }}
                      displayEmpty
                      fullWidth
                      inputProps={{
                        name: "continueOn",
                        id: "continueOn-selector"
                      }}
                      error={error.key === 'continueOn' ? true : false}
                      helperText={error.key === 'continueOn' ? error.msg: null}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={0}>0</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl required fullWidth>
                    <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                      Instant On
                    </InputLabel>
                    <Select
                      value={instantOn}
                      onChange={(e) => { setInstantOn(e.target.value) }}
                      displayEmpty
                      fullWidth
                      inputProps={{
                        name: "instantOn",
                        id: "instantOn-selector"
                      }}
                      error={error.key === 'instantOn' ? true : false}
                      helperText={error.key === 'instantOn' ? error.msg: null}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={0}>0</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl required fullWidth>
                    <TextField
                      label='On Time'
                      id='onTime'
                      name='onTime'
                      autoFocus
                      required
                      value={onTime}
                      error={error.key === 'onTime' ? true : false}
                      helperText={error.key === 'onTime' ? error.msg: null}
                      onChange={(e) => { setOnTime(e.target.value) }}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl required fullWidth>
                    <TextField
                      label='Off Time'
                      id='offTime'
                      name='offTime'
                      autoFocus
                      required
                      value={offTime}
                      error={error.key === 'offTime' ? true : false}
                      helperText={error.key === 'offTime' ? error.msg: null}
                      onChange={(e) => { setOffTime(e.target.value) }}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
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
      </Paper>
    </Drawer>
  )
}


const mapStateToProps = state => {
  return {
    user: state.system.user
  };
};


export default connect(mapStateToProps, null)(withDialog(withSnackbar(DeviceConfigDrawer)));