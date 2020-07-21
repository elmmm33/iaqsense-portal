import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Grid, Paper, Typography, TextField, TablePagination, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SubjectIcon from '@material-ui/icons/Subject';
import PageLoadingView from '../../components/PageLoadingView/PageLoadingView';
import PageErrorView from '../../components/PageErrorView/PageErrorView';
import DeviceCard from '../../components/DeviceCard/DeviceCard';


import envars from '../../envars';
import api, { handleApiFailureWithDialog } from '../../utils/api';
import { withSnackbar } from '../../containers/SnackbarManager/SnackbarManager';
import { withDialog } from '../../containers/DialogManager/DialogManager';

const DashboardPage = props => {
  const [initLoad, setInitLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [devices, setDevices] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  useEffect(() => {
    if (initLoad === false) {
      fetchData();
      setInitLoaded(true);
    }
  });

  useEffect(() => {
    if (initLoad === false) return;
    fetchData();
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    setLoaded(false);
    let querys = [];
    querys.push(`page=${page}`);
    querys.push(`size=${rowsPerPage}`);
    console.log(envars.authServiceUrl);
    let deviceApiResult = await api('get', `${envars.deviceServiceUrl}/devices?${querys.join('&')}`, null);
    if (deviceApiResult.data.success) {
      setCount(deviceApiResult.data.result.count);

      let devices = deviceApiResult.data.result.devices;
      setDevices(devices);
      setLoaded(true);
    } else {
      handleApiFailureWithDialog(props.requestDialog, deviceApiResult);
    }
  };

  const onPageChangeHandler = (e, pageStartsFromZero) => {
    setPage(pageStartsFromZero + 1);
  };

  const onRowsPerPageChangeHandler = (e) => {
    setPage(1);
    setRowsPerPage(e.target.value);
  };


  if (!loaded) {
    return <PageLoadingView />;
  }

  return (
    <div className="paper-with-padding">
      <Grid container spacing={24}>
        <Grid item xs>
          <Typography variant="h4" component="h2">
            Device
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={24}>
        <Grid item xs>
          <Paper className="paper-with-padding">
            <Grid item xs>
              <Typography variant="h5" component="h5">
                <SubjectIcon fontSize="large" />
              </Typography>
            </Grid>
            <Grid container spacing={16}>
              {devices.map((device, i) => {
                return (
                  <Grid item xs={12} sm={4} key={`device-grid-${i}`} className="deviceCardContainer"  style={{padding: 8}}>
                    <DeviceCard device={device} onClickHandler={()=>{}}/>
                  </Grid>
                )
              })}
            </Grid>
            <Grid item xs>
              <TablePagination
                rowsPerPageOptions={[30, 60, 90]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page - 1}
                backIconButtonProps={{
                  'aria-label': 'Previous Page'
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page'
                }}
                onChangePage={onPageChangeHandler}
                onChangeRowsPerPage={onRowsPerPageChangeHandler}
              />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}


const mapStateToProps = state => {
  return {
    user: state.system.user
  };
};



export default connect(mapStateToProps, null)(withDialog(withSnackbar(DashboardPage)));
