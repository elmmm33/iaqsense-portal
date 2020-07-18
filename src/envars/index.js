let envars;
if (process.env.REACT_APP_EVQSENSE_PORTAL_ENV === 'prd') {
  envars = {
    authServiceUrl: "https://evqsense-auth-ServiceUrl-prd-pxc7sacouq-an.a.run.app",
    telemetryServiceUrl: "https://evqsense-telemetry-ServiceUrl-prd-pxc7sacouq-an.a.run.app",
    deviceServiceUrl: "https://evqsense-device-ServiceUrl-prd-pxc7sacouq-an.a.run.app"
  }
} else if (process.env.REACT_APP_EVQSENSE_PORTAL_ENV === 'dev') {
  envars = {
    authServiceUrl: "https://evqsense-auth-ServiceUrl-dev-3togabxujq-an.a.run.app",
    telemetryServiceUrl: "https://evqsense-telemetry-ServiceUrl-dev-3togabxujq-an.a.run.app",
    deviceServiceUrl: "https://evqsense-device-ServiceUrl-dev-3togabxujq-an.a.run.app"
  }
}else{
  envars = {
    // authServiceUrl: "https://evqsense-auth-ServiceUrl-dev-3togabxujq-an.a.run.app",
    authServiceUrl: "http://localhost:3002",
    telemetryServiceUrl: "https://evqsense-telemetry-ServiceUrl-dev-3togabxujq-an.a.run.app",
    deviceServiceUrl: "https://evqsense-device-ServiceUrl-dev-3togabxujq-an.a.run.app"
  }
}
  
  
export default envars;