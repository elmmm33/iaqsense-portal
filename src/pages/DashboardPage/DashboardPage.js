import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Grid, Paper, Typography, TextField, TablePagination, InputAdornment, FormControl, InputLabel, Select, MenuItem, Button
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import SubjectIcon from '@material-ui/icons/Subject';

import PageLoadingView from '../../components/PageLoadingView/PageLoadingView';
import PageErrorView from '../../components/PageErrorView/PageErrorView';
import DeviceCard from '../../components/DeviceCard/DeviceCard';

import envars from '../../envars';
import api, { handleApiFailureWithDialog } from '../../utils/api';
import useDebounce from '../../utils/useDebounce';
import { withSnackbar } from '../../containers/SnackbarManager/SnackbarManager';
import { withDialog } from '../../containers/DialogManager/DialogManager';
import DeviceAddDrawer from '../../containers/DeviceAddDrawer/DeviceAddDrawer';

const DashboardPage = props => {
  const [loaded, setLoaded] = useState(false);
  const [devices, setDevices] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  const [selectedId, setSelectedId] = useState('');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');

  const [addingNewDevice, setAddingNewDevice] = useState(false);

  const debouncedSelectedId = useDebounce(selectedId, 200);
  const debouncedKeyword = useDebounce(keyword, 200);

  useEffect(() => {
    if (!loaded) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, type, debouncedSelectedId, debouncedKeyword]);

  const fetchData = _.debounce(async () => {
    setLoaded(false);
    // let querys = [];
    // querys.push(`page=${page}`);
    // querys.push(`size=${rowsPerPage}`);
    let deviceApiResult = await api('get', `${envars.deviceServiceUrl}/devices`, null);
    if (deviceApiResult.data.success) {
      setCount(deviceApiResult.data.result.count);

      let devices = deviceApiResult.data.result.devices;
      let filterDevices = filterData(devices);

      setDevices(filterDevices);
      setLoaded(true);
    } else {
      handleApiFailureWithDialog(props.requestDialog, deviceApiResult);
    }
  }, 500);

  const filterData = (data) => {
    let filterData = [...data];
    if (debouncedKeyword !== "") {
      filterData = filterData.filter(d =>
        d.name.includes(debouncedKeyword) ||
        d.location.includes(debouncedKeyword))
    }

    if (debouncedSelectedId !== "") {
      filterData = filterData.filter(d => d.deviceId.includes(debouncedSelectedId));
    }

    if (type !== '') {
      filterData = filterData.filter(d => d.type === type)
    }
    filterData = filterData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return filterData;
  }

  const onPageChangeHandler = (e, pageStartsFromZero) => {
    setPage(pageStartsFromZero);
  };

  const onRowsPerPageChangeHandler = (e) => {
    setPage(0);
    setRowsPerPage(e.target.value);
  };

  const onKeywordChanged = (e) => {
    setPage(0);
    setKeyword(e.target.value);
  }

  const onSelectedIdChanged = (e) => {
    setPage(0);
    setSelectedId(e.target.value);
  }

  const onTypeChange = (e) => {
    setPage(0);
    setType(e.target.value);
  }

  // if (!loaded) {
  //   return <PageLoadingView />;
  // }

  return (
    <div className="paper-with-padding">
      <Grid container spacing={1} justify="flex-start">
        <Grid item>
          <Typography variant="h4" component="h2">
            Devices
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={() => { setAddingNewDevice(true) }}
            color="secondary"
            variant="contained"
          >
            <AddIcon />
            Add New
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12}>
          <Paper className="paper-with-padding">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth >
                  <TextField
                    label="Search By Device ID"
                    margin="normal"
                    value={selectedId}
                    fullWidth
                    onChange={onSelectedIdChanged}
                    // onChange= {ev => onKeywordChanged(ev.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} >
                <FormControl fullWidth >
                  <TextField
                    label="Search By Device Name/ Location"
                    margin="normal"
                    value={keyword}
                    fullWidth
                    onChange={onKeywordChanged}
                    // onChange= {ev => onKeywordChanged(ev.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={8} sm={3}>
                <FormControl fullWidth margin='normal'>
                  <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Type
                  </InputLabel>
                  <Select
                    value={type}
                    onChange={onTypeChange}
                    displayEmpty
                    fullWidth
                    inputProps={{
                      name: "type",
                      id: "type-selector"
                    }}
                  >
                    <MenuItem value={''}>None</MenuItem>
                    <MenuItem value={'IAQ'}>IAQ</MenuItem>
                    <MenuItem value={'EM'}>EM</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs>
          <Paper className="paper-with-padding">
            <Grid item xs>
              <Typography variant="body1" component="h2">
                <SubjectIcon />
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              {!loaded ? (
                <Grid item xs={12}>
                  <PageLoadingView />
                </Grid>
              ) : (
                  devices.map((device, i) => {
                    return (
                      <Grid item xs={12} sm={4} key={`device-grid-${i}`} className="deviceCardContainer" margin='normal'>
                        <DeviceCard device={device} onClickHandler={() => { props.history.push(`/devices/${device.deviceId}`); }} />
                      </Grid>
                    )
                  })
                )}
            </Grid>
            <Grid item xs>
              <TablePagination
                rowsPerPageOptions={[30, 60, 90]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
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
      <DeviceAddDrawer
        open={addingNewDevice}
        onBeforeCloseHandler={(newDevice)=>{
          if(newDevice){
            fetchData();
          }
          setAddingNewDevice(false);
        }}
      />
    </div>
  )
}


const mapStateToProps = state => {
  return {
    user: state.system.user
  };
};



export default connect(mapStateToProps, null)(withDialog(withSnackbar(DashboardPage)));
