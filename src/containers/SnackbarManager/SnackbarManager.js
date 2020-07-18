import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const SnackbarManager = props => {
  const { snackbarQueue, dequeueSnackbar } = props;
  const [queue, setQueue] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentSnackbar, setCurrentSnackbar] = useState({});

  useEffect(() => {
    if (snackbarQueue.length > 0) {
      enqueue(snackbarQueue[0]);
      dequeueSnackbar();
    }
  }, snackbarQueue)

  const enqueue = snackbar => {
    if (open && currentSnackbar.message == snackbar.message) {
      //Enqueuing Message is the same as the last message, skip
      return;
    }

    let newQueue = [...queue];
    newQueue.push({
      ...snackbar,
      key: new Date().getTime()
    });
    setQueue(newQueue);

    if (open) {
      // immediately begin dismissing current message
      // to start showing new one
      setOpen(false);
    } else {
      processQueue();
    }
  };

  const processQueue = () => {
    if (queue.length > 0) {
      setCurrentSnackbar(queue.shift());
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    processQueue();
  }

  return (
    <div>
      <Snackbar
        key={currentSnackbar.key}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        onExited={handleExited}
        ContentProps={{
          'aria-describedby': 'snackbar-message'
        }}
        message={<span id="snackbar-message">{currentSnackbar.message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            // className={classes.close}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </div>
  )
}


let mapStateToProps = state => {
  return {
    snackbarQueue: state.system.snackbarQueue
  };
};

let mapDispatchToProps = dispatch => {
  return {
    dequeueSnackbar: () =>
      dispatch({
        type: 'DEQUEUE_SNACKBAR',
        payload: {}
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SnackbarManager);


export const withSnackbar = component => {
  return connect(
    null,
    dispatch => {
      return {
        makeSnackbar: message =>
          dispatch({
            type: 'ENQUEUE_SNACKBAR',
            payload: {
              snackbar: {
                message: message
              }
            }
          })
      };
    }
  )(component);
};