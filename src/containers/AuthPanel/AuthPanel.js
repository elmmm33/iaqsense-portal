import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import axios from 'axios';
import envars from '../../envars';

import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { dialog } from '../../components/Dialog/Dialog';
import { themeStyle } from '../../Themes';
import './AuthPanel.css';

const AuthPanel = props => {
  const [action, setAction] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEamilInputChangedHandler = (event) => {
    setEmail(event.target.value );
  }

  const onPasswordInputChangedHandler = (event) => {
    setPassword(event.target.value );
  }
 
  const onLoginSubmitHandler = async event => {
    try {
      let apiResult;
      try {
        apiResult = await axios.post(`${envars.authServiceUrl}/session`, {
          email,
          password
        });
      } catch (e) {
        apiResult = e.response;
      }
      if (apiResult.data && apiResult.data.success) {
        // console.log(apiResult.data);
        if(apiResult.data.result.role >= 2){
          let authToken = apiResult.data.result.token;
          sessionStorage.setItem('authToken', authToken);
          props.login(authToken);
        }else{
          dialog({ icon: 'times-circle', message: 'Please contact Admin to upgrade your account.' });
        }
      } else {
        dialog({
          icon: 'times-circle',
          message: apiResult.data.msg
        });
      }
    } catch (e) {
      dialog({ icon: 'times-circle', message: e.message });
    }
  };

  return (
    <div className="auth-panel col-12">
      <CssBaseline />
      <Paper className="auth-panel-login-paper">
        <Typography component="h1" variant="h5">
          Log in
        </Typography>

        <form>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input id="email" name="email" autoComplete="email" autoFocus value={email} onChange={onEamilInputChangedHandler} />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input name="password" type="password" id="password" autoComplete="current-password" value={password} onChange={onPasswordInputChangedHandler} />
          </FormControl>
          <Button className={props.classes.loginButton} fullWidth variant="contained"  color="primary" onClick={onLoginSubmitHandler}>
            Sign in
          </Button>
        </form>
      </Paper>
    </div>
  );
}

const styles = theme => ({
	loginButton: {
    // background: themeStyle.palette.primary
    marginTop: 8,
    background: themeStyle.gradientContained
  }
});

const mapStateToProps = state => {
  return {
    user: state.system.user,
    authToken: state.system.authToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: authToken => dispatch({ type: 'LOGIN', payload: { authToken } })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AuthPanel));
