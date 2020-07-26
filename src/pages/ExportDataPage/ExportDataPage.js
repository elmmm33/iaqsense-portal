import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Grid, Paper, Typography, Button, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton, Avatar
} from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import SubjectIcon from '@material-ui/icons/Subject';
import GetAppIcon from '@material-ui/icons/GetApp';
import DescriptionIcon from '@material-ui/icons/Description';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import envars from '../../envars';
import api, { handleApiFailureWithDialog } from '../../utils/api';

import PageLoadingView from '../../components/PageLoadingView/PageLoadingView';
import { withSnackbar } from '../../containers/SnackbarManager/SnackbarManager';
import { withDialog } from '../../containers/DialogManager/DialogManager';

const ExportDataPage = props => {
  const maxDate = new Date(new Date().toDateString());

  const current = new Date(new Date().toDateString());
  const minDate = new Date(current.setDate(current.getDate() - 7));

  const [exportFileClick, setExportFileClick] = useState(false);
  const [filePreparing, setFilePreparing] = useState(false);
  const [to, setTo] = useState(maxDate);
  const [from, setFrom] = useState(minDate);

  const [IAQFileName, setIAQFileName] = useState(null);
  const [EMFileName, setEMFileName] = useState(null);
  const [IAQTempUrl, setIAQTempUrl] = useState(null);
  const [EMTempUrl, setEMTempUrl] = useState(null);

  const dateDisabled = date => (date.getTime() < minDate.getTime() || date.getTime() > maxDate.getTime())
  const exportButtonClick = async (e) => {
    setExportFileClick(true);
    setFilePreparing(true);

    await Promise.all([exportIAQData(), exportEMData()]);
    setFilePreparing(false);
  }

  const exportIAQData = async () => {
    let querys = [];
    querys.push(`from=${from.getTime()}`);
    querys.push(`to=${to.getTime()}`);

    const options = {
      responseType: 'blob',
    };

    let exportDataApiResult = await api('get', `${envars.telemetryServiceUrl}/telemetry/csv/iaq?${querys.join('&')}`, null, options);
    if (exportDataApiResult.data) {
      const disposition = exportDataApiResult.headers['content-disposition'];
      if (disposition && disposition.match(/attachment/)) {
        let filename = disposition.replace(/attachment;.*filename=/, '').replace(/"/g, '');
        const file = new Blob([exportDataApiResult.data]);
        const tempUrl = window.URL.createObjectURL(file);
        setIAQFileName(filename);
        setIAQTempUrl(tempUrl);
      }
    }
  }

  const exportEMData = async () => {
    let querys = [];
    querys.push(`from=${from.getTime()}`);
    querys.push(`to=${to.getTime()}`);

    const options = {
      responseType: 'blob',
    };

    let exportDataApiResult = await api('get', `${envars.telemetryServiceUrl}/telemetry/csv/em?${querys.join('&')}`, null, options);
    if (exportDataApiResult.data) {
      const disposition = exportDataApiResult.headers['content-disposition'];
      if (disposition && disposition.match(/attachment/)) {
        let filename = disposition.replace(/attachment;.*filename=/, '').replace(/"/g, '');
        const file = new Blob([exportDataApiResult.data]);
        const tempUrl = window.URL.createObjectURL(file);
        setEMFileName(filename);
        setEMTempUrl(tempUrl);
      }
    }
  }


  const FileItem = (fileName, url) => {
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={fileName}
        />
        <ListItemSecondaryAction>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              link.click();
            }}>
            <GetAppIcon />
          </Button>
        </ListItemSecondaryAction>
      </ListItem >
    )
  }

  return (
    <div className="paper-with-padding">
      <Grid container spacing={1} justify="flex-start">
        <Grid item>
          <Typography variant="h4" component="h2">
            Export Calibration Data
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12}>
          <Paper className="paper-with-padding">
            <Grid container spacing={3} alignItems='center'>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid item xs={12} sm={4}>
                  <KeyboardDateTimePicker
                    id='start-from'
                    variant="inline"
                    ampm={false}
                    label="Start From"
                    value={from}
                    onChange={setFrom}
                    shouldDisableDate={dateDisabled}
                    format="yyyy/MM/dd HH:mm"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <KeyboardDateTimePicker
                    id='end-to'
                    variant="inline"
                    ampm={false}
                    label="End To"
                    value={to}
                    onChange={setTo}
                    shouldDisableDate={dateDisabled}
                    format="yyyy/MM/dd HH:mm"
                    margin="normal"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Grid container justify="flex-end">
                    <Button
                      onClick={exportButtonClick}
                      color="secondary"
                      variant="contained"
                    >
                      <DescriptionIcon />
                    Export
                  </Button>
                  </Grid>
                </Grid>
              </MuiPickersUtilsProvider>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      {exportFileClick ? (
        <Grid container spacing={4}>
          <Grid item xs>
            <Paper className="paper-with-padding">
              <Grid item xs>
                <Typography variant="body1" component="h2">
                  <SubjectIcon />
                </Typography>
              </Grid>
              <Grid container spacing={2}>
                {filePreparing ? (
                  <Grid item xs={12}>
                    <PageLoadingView />
                  </Grid>
                ) : (
                    <Grid item xs={12}>
                      <List>
                        <Grid item xs={12}>
                          {FileItem(IAQFileName, IAQTempUrl)}
                        </Grid>
                        <Grid item xs={12}>
                          {FileItem(EMFileName, EMTempUrl)}
                        </Grid>
                      </List>
                    </Grid>
                  )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      ) : null}
    </div>
  )
}



const mapStateToProps = state => {
  return {
    user: state.system.user
  };
};

export default connect(mapStateToProps, null)(withDialog(withSnackbar(ExportDataPage)));
