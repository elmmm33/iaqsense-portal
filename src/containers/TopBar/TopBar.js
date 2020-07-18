import React, { useEffect, useState } from 'react';
import { AppBar, Hidden, IconButton, Toolbar, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import TopBarUserView from '../../containers/TopBarUserView/TopBarUserView';

const TopBar = props => {
	const { user, classes, onOpenMobileMenu } = props;
	return (
		<AppBar position="fixed" color="primary" className={classes.appBar}>
			<Toolbar>
				<Hidden mdUp implementation="css">
					<IconButton color="inherit" aria-label="Open drawer" onClick={onOpenMobileMenu}>
						<MenuIcon />
					</IconButton>
				</Hidden>
				<Typography variant="h6" color="inherit" noWrap>
					EVQ Sense
			</Typography>
				<div style={{ flexGrow: 1 }} />
				<TopBarUserView user={user} />
			</Toolbar>
		</AppBar>
	)
}

const styles = theme => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		height: 64
	}
});

const mapStateToProps = state => {
	return {
		user: state.system.user
	};
};

// const mapDispatchToProps = dispatch => {
//   return {
//     selectProductId: id => dispatch({ type: 'SELECT_PRODUCT_ID', payload: { productId: id } })
//   };
// };

export default withRouter(
	connect(
		mapStateToProps,
		null
	)(withStyles(styles)(TopBar))
);
