import React, { Component, useState, useEffect } from 'react';
import { Paper } from '@material-ui/core';
import MuiVirtualizedTable from '../../components/MuiVirtualizedTable/MuiVirtualizedTable';
import { IAQ_TYPE, EM_TYPE } from '../../utils/constants';
import toHKTimeString from '../../utils/to-hk-time-string';

const IAQ_TABLE_COLUMNS = ([
  { width: 200, dataKey: 'timestamp', label: 'Timestamp' },
  { width: 120, numeric: true, dataKey: 'temperature', label: 'Temperature\u00A0(°C)' },
  { width: 120, numeric: true, dataKey: 'humidity', label: 'Humidity\u00A0(%)' },
  { width: 120, numeric: true, dataKey: 'pm10', label: 'PM\u00A010\u00A0(μg/m3)' },
  { width: 120, numeric: true, dataKey: 'pm25', label: 'PM\u00A02.5\u00A0(μg/m3)' },
  { width: 120, numeric: true, dataKey: 'co', label: 'CO\u00A0(ppm)' },
  { width: 120, numeric: true, dataKey: 'co2', label: 'CO2\u00A0(ppm)' },
  { width: 120, numeric: true, dataKey: 'voc', label: 'VOC\u00A0(μg/m3)' },
  { width: 120, numeric: true, dataKey: 'hcn', label: 'HCN\u00A0(-)' }
])

const EM_TABLE_COLUMNS = [
  { width: 120, dataKey: 'timestamp', label: 'Timestamp' },
  { width: 120, numeric: true, dataKey: 'time', label: 'Time' },
  { width: 120, numeric: true, dataKey: 'irin', label: 'Irin' },
  { width: 120, numeric: true, dataKey: 'irout', label: 'Irout' }
]


function DeviceTelemetryTable(props) {
  const { data, type } = props;
  let columns;
  if(type === IAQ_TYPE){
    columns = IAQ_TABLE_COLUMNS;
    data.forEach(d => {
      d.timestamp = toHKTimeString(d.timestamp);
      d.temperature = parseFloat(d.temperature.toFixed(4));
      d.humidity = parseFloat(d.humidity.toFixed(4));
      d.pm10 = parseFloat(d.pm10.toFixed(4));
      d.pm25 = parseFloat(d.pm25.toFixed(4));
      d.co = parseFloat(d.co.toFixed(4));
      d.co2 = parseFloat(d.co2.toFixed(4));
      d.voc = parseFloat(d.voc.toFixed(4));
      d.hcn = parseFloat(d.hcn.toFixed(4));
    });  
  }else if (type === EM_TYPE){
    columns = EM_TABLE_COLUMNS;
    data.forEach(d => {
      d.timestamp = toHKTimeString(d.timestamp);
      d.time = parseFloat(d.time.toFixed(4));
      d.irin = parseFloat(d.irin.toFixed(4));
      d.irout = parseFloat(d.irout.toFixed(4));
    });  
  }

  return (
    <Paper style={{ height: 728, width: "100%", marginTop: '16px' }}>
      <MuiVirtualizedTable
        rowCount={data.length}
        rowGetter={({ index }) => data[index]}
        columns= {columns}
      />
    </Paper>
  )
}

export default DeviceTelemetryTable;