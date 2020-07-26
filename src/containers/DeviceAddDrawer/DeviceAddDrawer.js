import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Drawer, Grid, Paper, Typography, FormControl, TextField, InputLabel, Button, Select, MenuItem, FormHelperText } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

import envars from '../../envars';
import api, { handleApiFailureWithDialog } from '../../utils/api';
import toHKTimeString from '../../utils/to-hk-time-string';

import { withSnackbar } from '../../containers/SnackbarManager/SnackbarManager';
import { withDialog } from '../../containers/DialogManager/DialogManager';

const DeviceAddDrawer = props => {
  const { open, onBeforeCloseHandler } = props;

  const [error, setError] = useState({ key: null, msg: null });

  const [deviceId, setDeviceId] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('IAQ');
  const [continueOn, setContinueOn] = useState(0);
  const [instantOn, setInstantOn] = useState(0);
  const [onTime, setOnTime] = useState(10);
  const [offTime, setOffTime] = useState(4);

  const onSaveButtonHandler = async () => {
    if (onTime > 59 || onTime <= 0) {
      setError({ 'key': 'onTime', 'msg': 'On Time need to between 1-59' });
      return;
    }
    if (offTime > 59 || offTime <= 0) {
      setError({ 'key': 'offTime', 'msg': 'Off Time need to between 1-59' });
      return;
    }

    const newDevice = {
      deviceId,
      name,
      location,
      type,
      continueOn,
      instantOn,
      onTime,
      offTime
    }

    for (let key of Object.keys(newDevice)) {
      if (newDevice[key] === '' || newDevice[key] === null) {
        setError({ 'key': key, 'msg': `Please Input ${key}` });
        return;
      }
    }

    setError({ key: null, msg: null });

    let addDeviceApiResult = await api('post', `${envars.deviceServiceUrl}/device/add`, newDevice);
    if (addDeviceApiResult.data.success) {
      props.makeSnackbar('Add Device Successfully.')
      let newDevice = addDeviceApiResult.data.result.device;
      // console.log(newDevice);
      onBeforeCloseHandler(newDevice);
    } else {
      handleApiFailureWithDialog(props.requestDialog, addDeviceApiResult);
    }


  }

  return (
    <Drawer anchor="right" open={open} onClose={() => { onBeforeCloseHandler() }}>
      <div className="drawer-on-right paper-with-padding">
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="h5">New Device</Typography>
          </Grid>
          <Grid item>
            <Paper className="paper-with-padding">
              <Typography variant="h6" gutterBottom>
                Device Info
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <FormControl required fullWidth>
                    <TextField
                      label='Device ID'
                      id='deviceID'
                      name='deviceID'
                      autoFocus
                      required
                      value={deviceId}
                      error={error.key === 'deviceId' ? true : false}
                      helperText={error.key === 'deviceId' ? error.msg : 'Can  Not Change Later'}
                      onChange={(e) => { setDeviceId(e.target.value) }}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl required fullWidth>
                    <TextField
                      label='Device Name'
                      id='name'
                      name='name'
                      autoFocus
                      required
                      value={name}
                      error={error.key === 'name' ? true : false}
                      helperText={error.key === 'name' ? error.msg : 'Can  Not Change Later'}
                      onChange={(e) => { setName(e.target.value) }}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl required fullWidth>
                    <TextField
                      label='Location'
                      id='location'
                      name='location'
                      autoFocus
                      required
                      value={location}
                      error={error.key === 'location' ? true : false}
                      helperText={error.key === 'location' ? error.msg : null}
                      onChange={(e) => { setLocation(e.target.value) }}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl required fullWidth>
                    <TextField
                      label='Type'
                      id='type'
                      name='type'
                      select
                      required
                      value={type}
                      error={error.key === 'type'}
                      helperText={error.key === 'type' ? error.msg : 'Can Not Change Later'}
                      onChange={(e) => {setType(e.target.value) }}
                      fullWidth
                    >
                      <MenuItem key={"IAQ"} value={'IAQ'}>IAQ</MenuItem>
                      <MenuItem key={'EM'} value={'EM'}>EM</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper className="paper-with-padding">
              <Typography variant="h6" gutterBottom>
                Device Config
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
                      helperText={error.key === 'continueOn' ? error.msg : null}
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
                      helperText={error.key === 'instantOn' ? error.msg : null}
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
                      helperText={error.key === 'onTime' ? error.msg : null}
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
                      helperText={error.key === 'offTime' ? error.msg : null}
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
      </div>
    </Drawer>
  )
}


const mapStateToProps = state => {
  return {
    user: state.system.user
  };
};


export default connect(mapStateToProps, null)(withDialog(withSnackbar(DeviceAddDrawer)));

