import axios from 'axios';
import errorMessageDict from './error-message-dict';

const api = async (method, url, data, extraOptions) => {
  let authToken = sessionStorage.getItem('authToken');

  let options = {
    method,
    url,
  };
  
  if (extraOptions) {
    options = {
      ...options,
      ...extraOptions
    };
  }

  if (authToken) {
    options.headers = { Authorization: `Bearer ${authToken}` };
  }

  if (data) {
    options.data = data;
  }

  let apiResult;
  try {
    apiResult = await axios(options);
  } catch (e) {
    if (e.response) {
      apiResult = e.response;
    } else {
      apiResult.data = {
        success: false,
        code: "SE-001",
        msg: 'Server Error'
      }
    };
  }

  // if (!apiResult.data.success) {
  //   if (apiResult.status == 404) {
  //     apiResult.data = {
  //       success: false,
  //       msg: 'Not Found',
  //       result: null,
  //       moment: moment().format()
  //     };
  //   } else if (apiResult.status == 500) {
  //     apiResult.data = {
  //       success: false,
  //       msg: 'Server Error',
  //       result: null,
  //       moment: moment().format()
  //     };
  //   }
  // }

  return apiResult;
};

export default api;

export const getErrorMessage = (apiResult) => {
  let apiError = apiResult.data;

  let message = apiError.msg;
  if (apiError.messageKey) {
    let messagePart = apiError.messageKey.split(',');

    if (messagePart[0] in errorMessageDict) {
      message = errorMessageDict[messagePart[0]];
      for (let i = 1; i < messagePart.length; i++) {
        message = message.replace(`___${i}___`, messagePart[i]);
      }
    } else {
      message = apiError.messageKey;
    }
  }
  return message;
};

export const handleApiFailureWithDialog = (requestDialog, apiResult, followUp = null) => {
  // console.log(JSON.stringify(apiResult.data));
  let apiError = apiResult.data;
  if (apiError.code && apiError.code.includes('AU-')) {
    if (requestDialog) {
      requestDialog({
        title: 'Session expired',
        text: 'Please login again',
        buttons: [{
          text: 'ok',
          onClick: () => {
            sessionStorage.clear();
            window.location.reload();
            return;
          }
        }],
      });
    }
  } else {
    // if (!apiError.action || apiError.action === 'DIALOG')
    requestDialog({
      title: 'Error',
      text: getErrorMessage(apiResult),
      buttons: [{
        text: 'OK',
        onClick: () => {
          if (followUp) { followUp(); }
        }
      }],
    });
  }
};

export const handleApiFailureWithSnackbar = (makeSnackbar, apiResult) => {
  // console.log(JSON.stringify(apiResult.data));
  let apiError = apiResult.data;

  if (apiError.code && apiError.code.includes('AU-')) {
    makeSnackbar('Please login again');
    sessionStorage.clear();
  } else {
    //  if (!apiError.action || apiError.action === 'DIALOG') 
    makeSnackbar(getErrorMessage(apiResult));
  }
};
