let envars;
if (process.env.REACT_APP_EVQSENSE_PORTAL_ENV === 'prd') {
  envars = {
    authServiceUrl: "https://evqsense-auth-service-prd-pxc7sacouq-an.a.run.app",
    telemetryServiceUrl: "https://evqsense-telemetry-service-prd-pxc7sacouq-an.a.run.app",
    // deviceServiceUrl: "https://evqsense-device-service-prd-pxc7sacouq-an.a.run.app"
    deviceServiceUrl: "http://localhost:3002"
  }
} else if (process.env.REACT_APP_EVQSENSE_PORTAL_ENV === 'dev') {
  envars = {
    authServiceUrl: "https://evqsense-auth-service-dev-3togabxujq-an.a.run.app",
    telemetryServiceUrl: "https://evqsense-telemetry-service-dev-3togabxujq-an.a.run.app",
    deviceServiceUrl: "https://evqsense-device-service-dev-3togabxujq-an.a.run.app"
  }
} else {
  envars = {
    authServiceUrl: "https://evqsense-auth-service-dev-3togabxujq-an.a.run.app",
    telemetryServiceUrl: "https://evqsense-telemetry-service-dev-3togabxujq-an.a.run.app",
    deviceServiceUrl: "https://evqsense-device-service-dev-3togabxujq-an.a.run.app"
    // deviceServiceUrl: "http://localhost:3002"
  }
}


export default envars;