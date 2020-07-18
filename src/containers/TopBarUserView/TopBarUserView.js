import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Popper, Grow, Paper, Grid, Typography, ClickAwayListener, IconButton, Menu, MenuList, MenuItem, ListItemIcon, ListItemText, Avatar, ButtonBase } from '@material-ui/core';
import ChangePasswordIcon from '../../icons/Asterisk';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import api from '../../utils/api';
import envars from '../../envars';

class TopBarUserView extends Component {
  state = {
    menuAnchorEl: null
  };

  onMenuCloseHandler = ev => {
    if (ev && this.state.menuAnchorEl != null && this.state.menuAnchorEl.contains(ev.target)) {
      // if click on the toggle button again, don't do anything and let the toggle handle it
      return;
    }
    this.setState({ menuAnchorEl: null });
  };

  onMenuToggleHander = ev => {
    this.setState({
      menuAnchorEl: this.state.menuAnchorEl ? null : ev.currentTarget
    });
  };

  onPasswordButtonHandler = () => {
    // this.props.history.push('/passwords');
  };

  onLogoutButtonHandler = async () => {
    this.setState({ menuAnchorEl: null });
    // try {
    //   await api('delete', `${envars.authServiceUrl}/sessions/${this.props.staff.id}`);
    // } catch (e) {
    //   // Logout anyway
    // }
    this.props.logout();
    this.props.history.push('/');
  };


  render = () => {
    let { user, selectedProductId, products } = this.props;
    let { menuAnchorEl } = this.state;

    return (
      <Fragment>
        <ButtonBase aria-owns={menuAnchorEl ? 'action-menu' : undefined} aria-haspopup="true" onClick={this.onMenuToggleHander}>
          <Grid container spacing={1}>
            <Grid item>
              <Typography color="inherit">{user.email.split('@')[0]}</Typography>
              {/* <Typography color="inherit" variant="caption">
                {products.find(p => p.id == selectedProductId).name}
              </Typography> */}
            </Grid>
            <Grid item>
              <Avatar>R</Avatar>
            </Grid>
          </Grid>
        </ButtonBase>

        <Popper open={menuAnchorEl ? true : false} anchorEl={menuAnchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps} id="action-menu" style={{ transformOrigin: placement === 'bottom' ? 'right top' : 'right bottom' }}>
              <Paper>
                <ClickAwayListener onClickAway={this.onMenuCloseHandler}>
                  <Fragment>
                    <div className="paper-with-padding">
                      <Grid container spacing={8}>
                        <Grid item>
                          <Avatar>R</Avatar>
                        </Grid>
                        <Grid item xs>
                          <Typography color="inherit">{user.email.split('@')[0]}</Typography>
                        </Grid>
                        {/* <Grid item xs>
                        <ProductSelector
                          color="inherit"
                          products={this.props.products}
                          productIds={this.getSelectableProductIds()}
                          value={this.props.selectedProductId}
                          onSelect={this.onProductSelectHandler}
                        />
                      </Grid> */}
                      </Grid>
                    </div>
                    <MenuList>
                      <MenuItem onClick={this.onPasswordButtonHandler}>
                        <ListItemIcon>
                          <ChangePasswordIcon />
                        </ListItemIcon>
                        <ListItemText>Change Password</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={this.onLogoutButtonHandler}>
                        <ListItemIcon>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                      </MenuItem>
                    </MenuList>
                  </Fragment>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Fragment>
    );
  };
}

const mapStateToProps = state => {
  return {
    user: state.system.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch({ type: 'LOGOUT' })
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopBarUserView));
