import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

class SnackbarManager extends Component {
  queue = [];

  state = {
    open: false,
    currentSnackbar: {}
  };

  componentDidUpdate = () => {
    if (this.props.snackbarQueue.length > 0) {
      this.enqueue(this.props.snackbarQueue[0]);
      this.props.dequeueSnackbar();
    }
  };

  enqueue = snackbar => {
    if (this.state.open && this.state.currentSnackbar.message == snackbar.message) {
      //Enqueuing Message is the same as the last message, skip
      return;
    }

    this.queue.push({
      ...snackbar,
      key: new Date().getTime()
    });

    if (this.state.open) {
      // immediately begin dismissing current message
      // to start showing new one
      this.setState({ open: false });
    } else {
      this.processQueue();
    }
  };

  processQueue = () => {
    if (this.queue.length > 0) {
      this.setState({
        currentSnackbar: this.queue.shift(),
        open: true
      });
    }
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
  };

  handleExited = () => {
    this.processQueue();
  };

  render() {
    const { currentSnackbar } = this.state;
    const { message, extraAction } = currentSnackbar;
    return (
      <div>
        <Snackbar
          key={currentSnackbar.key}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.open}
          autoHideDuration={3000}
          onClose={this.handleClose}
          onExited={this.handleExited}
          ContentProps={{
            'aria-describedby': 'snackbar-message'
          }}
          message={<span id="snackbar-message">{message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              // className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </div>
    );
  }
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
