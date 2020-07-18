import React from 'react';
import { Paper, Button, Typography } from '@material-ui/core';
import FontAwesome from 'react-fontawesome';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './Dialog.css';

let Dialog = props => {
  return (
    <Paper className="paper-with-padding dialog">
      {props.icon ? (
        <Typography component="div" variant="h2" color="primary">
          <FontAwesome name={props.icon} />
        </Typography>
      ) : null}

      <Typography gutterBottom>{props.message}</Typography>
      {props.buttonConfig.map((b, inb) => (
        <Button
          key={inb}
          variant="contained"
          onClick={() => {
            if (b.onClick) b.onClick();
            props.onClose();
          }}
        >
          {b.label}
        </Button>
      ))}
    </Paper>
  );
};

export default Dialog;

export const dialog = ({ icon, message, buttonConfig }) => {
  if (!buttonConfig) {
    buttonConfig = [
      {
        icon: 'check',
        label: 'OK'
      }
    ];
  }
  confirmAlert({
    customUI: ({ onClose }) => {
      return <Dialog icon={icon} message={message} buttonConfig={buttonConfig} onClose={onClose} />;
    }
  });
};
