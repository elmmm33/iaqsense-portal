let initialState = {
    authToken: null,
    user:null,
    snackbarQueue: [],
    dialogRequest: null
  };
  
  const reducer = (originalState = initialState, action) => {
    if (action.type === 'INIT_APP') {
      return {
        ...originalState
      };
    } else if (action.type === 'LOGIN') {
      let user = JSON.parse(atob(action.payload.authToken.split('.')[1]));
      // console.log(user);
      return {
        ...originalState,
        authToken: action.payload.authToken,
        user,
      };
    } else if (action.type === 'LOGOUT') {
      sessionStorage.clear();
      return {
        ...originalState,
        authToken: null,
        user: null
      };
    } else if (action.type === 'ENQUEUE_SNACKBAR') {
      console.log('ENQUEUE_SNACKBAR', JSON.stringify(action.payload));
      return {
        ...originalState,
        snackbarQueue: [...originalState.snackbarQueue, action.payload.snackbar]
      };
    } else if (action.type === 'DEQUEUE_SNACKBAR') {
      console.log('DEQUEUE_SNACKBAR');
      let snackbarQueue = [...originalState.snackbarQueue];
      snackbarQueue.splice(0);
      return {
        ...originalState,
        snackbarQueue: snackbarQueue
      };
    } else if (action.type === 'PLACE_DIALOG_REQUEST') {
      console.log('PLACE_DIALOG_REQUEST');
      return {
        ...originalState,
        dialogRequest: action.payload.dialogRequest
      };
    } else if (action.type === 'REMOVE_DIALOG_REQUEST') {
      console.log('REMOVE_DIALOG_REQUEST');
      return {
        ...originalState,
        dialogRequest: null
      };
    }
  
    return originalState;
  };
  
  export default reducer;
  