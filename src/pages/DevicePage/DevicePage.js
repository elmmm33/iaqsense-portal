import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import { TextField, Grid, Button, Paper, Typography, FormControl, List, ListItem, ListItemText } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PageLoadingView from '../../components/PageLoadingView/PageLoadingView';
import PageErrorView from '../../components/PageErrorView/PageErrorView';

import envars from '../../envars';
import api, { handleApiFailureWithDialog } from '../../utils/api';
import { IAQ_TYPE, EM_TYPE } from '../../utils/constants';
import toHKTimeString from '../../utils/to-hk-time-string';

import { withSnackbar } from '../../containers/SnackbarManager/SnackbarManager';
import { withDialog } from '../../containers/DialogManager/DialogManager';
import DeviceTelemetryTable from '../../containers/DeviceTelemetryTable/DeviceTelemetryTable';

const useInterval = (callback, delay, param) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [param]);
}

const DevicePage = props => {
  const deviceId = props.match.params.id;
  const [loaded, setLoaded] = useState(false);
  const [telemetryInitLoaded, setTelemetryInitLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [editingConfig, setEditingConfig] = useState(false);
  const [editingLocation, setEditingLoaction] = useState(false);

  const [device, setDevice] = useState(null);
  const [telemetryData, setTelemetryData] = useState([]);
  const [telemetryLastTime, setTelemetryLastTime] = useState(null);

  let telemetryInterval = 10000;

  useEffect(() => {
    fetchDeviceData();
    fetchTelemetryData();
  }, []);

  useInterval(async () => {
    await fetchTelemetryData();
  }, telemetryInterval, telemetryLastTime);

  const fetchDeviceData = async () => {
    setLoaded(false);
    let deviceApiResult = await api('get', `${envars.deviceServiceUrl}/device/${deviceId}`, null);
    if (deviceApiResult.data.success) {
      let device = deviceApiResult.data.result;
      setDevice(device);
      setLoaded(true);
    } else {
      handleApiFailureWithDialog(props.requestDialog, deviceApiResult);
    }
  }

  const fetchTelemetryData = async () => {
    // first loaded get 24 hours
    let querys = telemetryInitLoaded && telemetryLastTime ? [`?timestamp=${telemetryLastTime}`] : [];
    console.log("query time", telemetryLastTime, moment(telemetryLastTime).format());

    let telemetryApiResult = await api('get', `${envars.telemetryServiceUrl}/telemetry/${deviceId}/data${querys.join('&')}`);
    if (telemetryApiResult.data.success) {
      const results = telemetryApiResult.data.result;
      
      let data;
      if(results && results.length > 0){
        const lastDataTime = moment(results[results.length-1].timestamp, 'YYYY-MM-DDTHH:mm:ss').add(1, 's');
        setTelemetryLastTime(lastDataTime.valueOf()); // save the next time point;

        if (!telemetryInitLoaded) {
          setTelemetryInitLoaded(true);
          data = [...results];
        }else{
          data = [...telemetryData];
          results.forEach(result=>{data.push(result)});
        }  
      }else{
        data = [...telemetryData];
      }

      // filter outdate data
      data = data.filter(d=> moment().diff(moment(d.timestamp, 'YYYY-MM-DDTHH:mm:ss'), 'h') <= 24);
      data.sort((a, b) => {
        return (moment(b.timestamp, 'YYYY-MM-DDTHH:mm:ss').valueOf() - moment(a.timestamp, 'YYYY-MM-DDTHH:mm:ss').valueOf())
      });

      setTelemetryData(data);

      // console.log("api result", telemetryApiResult.data.result);
      // console.log("concat data", data.length);

    } else {
      handleApiFailureWithDialog(props.requestDialog, telemetryApiResult);
    }
  }


  if (!loaded) {
    return <PageLoadingView />;
  }

  return (
    <div className="paper-with-padding">
      <Grid container alignItems="flex-start" justify="flex-start" spacing={1}>
        <Grid item >
          <Typography variant="h4" component="h2" color="secondary">
            Device - {deviceId}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEditingConfig(true);
            }}
          >
            <EditIcon /> Edit Config
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              props.history.goBack();
            }}
          >
            <ArrowBackIosIcon />Back
          </Button>
        </Grid>
      </Grid>
      <Grid >
        <Grid item>
          <Typography variant="h6" color="textSecondary">Name: {device.name}</Typography>
        </Grid>
        <Grid item>
          <Grid container alignItems="flex-start" justify="flex-start" spacing={1}>
            <Grid item>
              <Typography variant="h6" color="textSecondary">Location: {device.location}</Typography>
            </Grid>
            <Grid item xs>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => {
                  setEditingLoaction(true);
                }}
              >
                <EditIcon fontSize='small' />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <DeviceTelemetryTable data={telemetryData} type={device.type}/>

    </div>
  )

}


const mapStateToProps = state => {
  return {
    user: state.system.user
  };
};


export default connect(mapStateToProps, null)(withDialog(withSnackbar(DevicePage)));
