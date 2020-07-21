import React from 'react';
import moment from 'moment';
import { Card, Typography, CardContent, CardActions, Button, Grid } from '@material-ui/core';
import NextIcon from '@material-ui/icons/KeyboardArrowRight';
import toHKTimeString from '../../utils/to-hk-time-string';

const DeviceCard = props => {
  let { device, onClickHandler } = props;

  return (
    <Card key={`device-card-${device.deviceId}`} >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Device ID: {device.deviceId}
        </Typography>
        <Typography color="textSecondary" component="h2">
          Type: {device.type}
        </Typography>
        <Typography variant="h5" component="h4">
          {device.name}
        </Typography>
        <Typography variant="body2" component="h2" noWrap={true}>
          Location: {device.location}
        </Typography>
        <Typography variant="body1" color="textSecondary" component="h5">
          Last Data Ingestion Time:
        </Typography>
        <Typography component="h5">
          {toHKTimeString(device.lastIngestionTime)}
        </Typography>
        <Grid container justify="flex-end">
          <Button size="small" onClick={onClickHandler}>Details<NextIcon /></Button>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DeviceCard;