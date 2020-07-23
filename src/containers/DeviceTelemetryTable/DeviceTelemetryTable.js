import React, { Component, useState, useEffect } from 'react';
import { Paper, Grid, Typography } from '@material-ui/core';
import SubjectIcon from '@material-ui/icons/Subject';

import { IAQ_TYPE, EM_TYPE } from '../../utils/constants';

import CustomizedTable from '../../components/CustomizedTable/CustomizedTable';
import CustomizedTableToolBar from '../../components/CustomizedTableToolBar/CustomizedTableToolBar';

const IAQ_TABLE_COLUMNS = ([
  {
    minWidth: 30, id: 'timestamp', label: 'Timestamp',
  },
  {
    minWidth: 30, id: 'temperature', label: 'Temperature\u00A0(°C)',
    format: (value) => parseFloat(value.toFixed(4))
  },
  {
    minWidth: 30, id: 'humidity', label: 'Humidity\u00A0(%)',
    format: (value) => parseFloat(value.toFixed(4))
  },
  {
    minWidth: 30, id: 'pm10', label: 'PM\u00A010\u00A0(μg/m3)',
    format: (value) => parseFloat(value.toFixed(4))
  },
  {
    minWidth: 30, id: 'pm25', label: 'PM\u00A02.5\u00A0(μg/m3)',
    format: (value) => parseFloat(value.toFixed(4))
  },
  {
    minWidth: 30, id: 'co', label: 'CO\u00A0(ppm)',
    format: (value) => parseFloat(value.toFixed(4))
  },
  {
    minWidth: 30, id: 'co2', label: 'CO2\u00A0(ppm)',
    format: (value) => parseFloat(value.toFixed(4))
  },
  {
    minWidth: 30, id: 'voc', label: 'VOC\u00A0(μg/m3)',
    format: (value) => parseFloat(value.toFixed(4))
  },
  {
    minWidth: 30, id: 'hcn', label: 'HCN\u00A0(-)',
    format: (value) => parseFloat(value.toFixed(4))
  }
])

const EM_TABLE_COLUMNS = [
  {
    minWidth: 30, id: 'timestamp', label: 'Timestamp',
  },
  {
    minWidth: 30, id: 'time', label: 'Time',
    format: (value) => parseFloat(value.toFixed(4))
  },
  {
    minWidth: 30, id: 'irin', label: 'Irin',
    format: (value) => parseFloat(value.toFixed(4))
  },
  {
    minWidth: 30, id: 'irout', label: 'Irout',
    format: (value) => parseFloat(value.toFixed(4))
  }
]


function DeviceTelemetryTable(props) {
  const { data, type } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  let columns = type === EM_TYPE ? EM_TABLE_COLUMNS : IAQ_TABLE_COLUMNS;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Grid container spacing={4}>
      <Grid item style={{ width: "100%" }}>
        <Paper className="paper-with-padding">
          <Grid item>
            <Typography variant="h5" component="h2">
              <SubjectIcon /> Calibration Data
            </Typography>
          </Grid>
          <Grid item>
            <CustomizedTable
              name={'calibrationTable'}
              rows={data}
              columns={columns}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[25, 50, 100]}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default DeviceTelemetryTable;
