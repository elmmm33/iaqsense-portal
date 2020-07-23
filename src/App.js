import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import './App.css';
import withGlobalUI from './utils/with-global-ui';
import api from './utils/api';
import envars from './envars';

import SnackbarManager from './containers/SnackbarManager/SnackbarManager';
import DialogManager from './containers/DialogManager/DialogManager';
import TopBar from './containers/TopBar/TopBar';
import NavBar from './containers/NavBar/NavBar';
import PageLoadingView from './components/PageLoadingView/PageLoadingView';

import LandingPage from './pages/LandingPage/LandingPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import DevicePage from './pages/DevicePage/DevicePage';


class App extends Component {
  state = {
    width: 0,
    height: 0,
    initAppDone: false,
    mobileShowMenu: false,
  };

  componentDidMount = () => {
    let authToken = sessionStorage.getItem('authToken');
    if (authToken) {
      console.log('resume login');
      this.props.login(authToken);
    }
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.props.initApp();
    this.setState({ initAppDone: true });
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  };

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render() {

    if (!this.props.user) {
      return (
        <div style={{ width: this.state.width, height: this.state.height}} >
          <BrowserRouter>
            <Switch>
              <Route path="/" component={LandingPage} />
            </Switch>
          </BrowserRouter>
          <SnackbarManager />
          <DialogManager />
        </div>
      );
    }

    if (!this.state.initAppDone) {
      return (
        <div style={{ width: this.state.width, height: this.state.height }}>
          <CssBaseline />
          <PageLoadingView />
          <SnackbarManager />
          <DialogManager />
        </div>
      );
    }

    return (
      <BrowserRouter>
        <div className="App">
          <CssBaseline />
          <TopBar onOpenMobileMenu={() => this.setState({ mobileShowMenu: true })} />
          <NavBar mobileOpen={this.state.mobileShowMenu} onMobileClose={() => this.setState({ mobileShowMenu: false })} />
          <main className="page-container">
            <Switch>
              <Route path="/" component={DashboardPage} exact />
              <Route path="/devices/:id" component={DevicePage} />
            </Switch>
          </main>
          <SnackbarManager />
          <DialogManager />
        </div>
      </BrowserRouter>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.system.user,
    snackbarManager: state.system.snackbarManager,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (authToken) =>
      dispatch({
        type: 'LOGIN',
        payload: {
          authToken,
        },
      }),
    initApp: () =>
      dispatch({
        type: 'INIT_APP',
        payload: {},
      })
  };
};

export default withGlobalUI(connect(mapStateToProps, mapDispatchToProps)(App));
