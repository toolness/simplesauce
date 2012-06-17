var config = require('../../config'),
    app = require('../../app'),
    webdriverUtils = require('../../webdriver-utils');

app.autoListen(function() {
  var subdirname = 'trees/toolness-slowparse-cb46ad1113726c656b1f78cc226f975a389bf86a';
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
