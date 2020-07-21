import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

class DialogManager extends Component {
  state = {
    dialogRequest: null
  };

  componentDidUpdate = () => {
    if (this.props.pendingDialogRequest) {
      this.setState({ dialogRequest: this.props.pendingDialogRequest });
      this.props.removeDialogRequest();
    }
  };

  onCloseHandler = () => {
    this.setState({ dialogRequest: null });
  };

  render() {
    const { dialogRequest } = this.state;

    /*
    dialogRequest Demo:
    {
      title:
      text:
      buttons:[
        {
          text:
          onClick:
          color:
        }
      ]

    }
    */

    if (!dialogRequest) {
      return <div />;
    }

    return (
      <div>
        <Dialog open={dialogRequest ? true : false} onClose={this.handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          {dialogRequest.title ? <DialogTitle id="alert-dialog-title">{dialogRequest.title}</DialogTitle> : null}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{dialogRequest.text}</DialogContentText>
          </DialogContent>
          <DialogActions>
            {dialogRequest.buttons.map(b => {
              return (
                <Button
                  onClick={ev => {
                    this.onCloseHandler();
                    if (b.onClick) {
                      b.onClick(ev);
                    }
                  }}
                  color={b.color || 'default'}
                  variant={b.variant}
                >
                  {b.text || 'OK'}
                </Button>
              );
            })}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    pendingDialogRequest: state.system.dialogRequest
  };
};

let mapDispatchToProps = dispatch => {
  return {
    removeDialogRequest: () =>
      dispatch({
        type: 'REMOVE_DIALOG_REQUEST',
        payload: {}
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DialogManager);

export const withDialog = component => {
  return connect(
    null,
    dispatch => {
      return {
        requestDialog: dialogRequest =>
          dispatch({
            type: 'PLACE_DIALOG_REQUEST',
            payload: {
              dialogRequest
            }
          })
      };
    }
  )(component);
};
