import React, { Component, useState, useEffect } from 'react';
import { Paper, Grid, Typography } from '@material-ui/core';
import SubjectIcon from '@material-ui/icons/Subject';

import { IAQ_TYPE, EM_TYPE } from '../../utils/constants';
import toHKTimeString from '../../utils/to-hk-time-string';

import PageLoadingView from '../../components/PageLoadingView/PageLoadingView';
import CustomizedTable from '../../components/CustomizedTable/CustomizedTable';
import CustomizedTableToolBar from '../../components/CustomizedTableToolBar/CustomizedTableToolBar';


const COLUMNS = [
  {
    minWidth: 30, id: 'timestamp', label: 'Timestamp',
  },
  {
    minWidth: 30, id: 'sleep', label: 'Sleep',
  },
  {
    minWidth: 30, id: 'startUp', label: 'Start Up',
  },
  {
    minWidth: 30, id: 'warmUp', label: 'Warm Up',
  }
]


function DeviceTelemetryFrequencyTable(props) {
  const { data } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  let columns = COLUMNS;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if(data === undefined || data.length == 0){
    return <PageLoadingView />;
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={12}>
        <Paper className="paper-with-padding">
          <Grid item>
            <Typography variant="h5" component="h2">
              <SubjectIcon /> Raw Data Frequence
            </Typography>
          </Grid>
          <Grid item>
            <CustomizedTable
              name={'frequncyTable'}
              rows={data}
              columns={columns}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default DeviceTelemetryFrequencyTable;
