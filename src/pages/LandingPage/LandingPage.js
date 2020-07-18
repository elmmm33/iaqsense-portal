import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

import { EVQSENSE_PORTAL_VERSION } from '../../utils/constants';
import AuthPanel from '../../containers/AuthPanel/AuthPanel';

class LandingPage extends Component {
  render() {
    return (
      <div style={{ margin: 20 }}>
        <Typography variant="h4">EVQ Sense</Typography>
        <Typography variant="caption" gutterBottom>{EVQSENSE_PORTAL_VERSION}</Typography>
        <AuthPanel />
      </div>
    );
  }
}

export default LandingPage;
