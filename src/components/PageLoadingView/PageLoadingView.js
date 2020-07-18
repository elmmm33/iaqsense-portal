import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import TimerSand from '../../icons/TimerSand';
import './PageLoadingView.css';

const PageLoadingView = props => {
  let { noPadding } = props;
  let style = {
    textAlign: 'center',
    paddingTop: noPadding ? 0 : 150,
    paddingBottom: noPadding ? 0 : 150
  };
  return (
    <div style={style}>
      <Grid container>
        <Grid item xs>
          <div>
            <div className="page-loading-view-icon">
                <TimerSand style={{ fontSize: '500%' }} />
            </div>
            <Typography color="textPrimary">{props.message ? props.message : 'Loading'}</Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
export default PageLoadingView;
