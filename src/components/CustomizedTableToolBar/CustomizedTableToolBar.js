import React, { Fragment } from 'react';
import clsx from "clsx";
import SearchIcon from '@material-ui/icons/Search';
import SubjectIcon from '@material-ui/icons/Subject';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Paper, Toolbar, Typography, Grid } from '@material-ui/core';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { tableTitle } = props;

  return (
    // <Paper className="paper-with-padding" >
    //   <Grid>
    //     {tableTitle ?
    //       (
    //         <Typography variant="h5" component="h2">
    //           <SubjectIcon fontSize="large" /> {tableTitle}
    //         </Typography>
    //       ) : null
    //     }
    //   </Grid>
    // </Paper>
    <Paper>
      {tableTitle ?
        (
          <Typography variant="h5" component="h2">
            <SubjectIcon fontSize="large" /> {tableTitle}
          </Typography>
        ) : null
      }
    </Paper>
  )
};

export default EnhancedTableToolbar;