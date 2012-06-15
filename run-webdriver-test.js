var config = require('./config'),
    app = require('./app'),
    webdriverUtils = require('./webdriver-utils');

app.autoListen(function() {
  var subdirname = 'toolness-slowparse-cb46ad1';
  var desired = {
    browserName:'chrome',
    tags: ["examples"],
    name: "This is an example test",
    "public": true,
    "record-video": false,
    "record-screenshots": false,
    "capture-html": true
  };

  var runsLeft = 2;
  
  function maybeQuit() {
    if (--runsLeft == 0)
      app.close();
  };
  
  webdriverUtils.runTests(subdirname, desired, function(err, result) {
    console.log(err, result);
    maybeQuit();
  });
  
  desired.browserName = 'firefox';
  webdriverUtils.runTests(subdirname, desired, function(err, result) {
    console.log(err, result);
    maybeQuit();
  });
});
