import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Hidden, Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';

import DashboardIcon from '@material-ui/icons/Dashboard';

const NavBar = props => {
  const { classes, mobileOpen, onMobileClose } = props;
  const [user, setUser] = useState(props.user);

  useEffect(()=>{
    if(user !== props.user){
      applyAuths();
    }
  })

  const applyAuths = () => {
    setUser(props.user);
  }

  let listItems = [];

  listItems.push(
    <ListItem
      key="dashboard"
      button
      onClick={() => {
        props.history.push('/');
        onMobileClose();
      }}
    >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText>Dashboard</ListItemText>
    </ListItem>
  );
  
  return(
    <Fragment>
    <Hidden smDown implementation="css">
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="left"
      >
        <List>{listItems}</List>
      </Drawer>
    </Hidden>

    <Hidden mdUp implementation="css">
      <Drawer
        className={classes.drawer}
        variant="temporary"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
      >
        <List>{listItems}</List>
      </Drawer>
    </Hidden>
  </Fragment>
  )
}


const mapStateToProps = state => {
  return {
    staff: state.system.staff,
    selectedProductId: state.system.selectedProductId,
    products: state.system.products
  };
};

const drawerWidth = 200;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    marginTop: 64
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
});

export default withRouter(connect(mapStateToProps, null)(withStyles(styles)(NavBar)));
