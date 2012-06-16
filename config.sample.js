var config = {
  // Only include this if you're integrating w/ saucelabs.
  sauce: {
    username: "your-saucelabs-username",
    key: "your-saucelabs-key"
  },
  // Hostname and port to listen for github post-receive hooks on.
  hostname: "localhost",
  port: 8432,
  // Base URL of the server; leave blank to auto-generate this, or
  // specify it explicitly if the server is behind a reverse proxy.
  baseURL: null,
  // Path to receive github post-receive hooks on. You can keep this
  // secret if you don't want other people issuing jobs to your server.
  postReceiveEndpoint: '/newjob',
  /// Additional options to curl.
  curlOptions: ['--insecure'],
  // Base desired capabilities for selenium2.
  capabilities: {
    "public": true,
    "record-video": false,
    "record-screenshots": false,
    "capture-html": true
  }
};

if (!config.baseURL)
  config.baseURL = "http://" + config.hostname + ":" + config.port;

module.exports = config;
