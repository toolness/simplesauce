var config = require('../../config'),
    app = require('../../app'),
    webdriverUtils = require('../../webdriver-utils'),
    assert = require('assert');

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
    if (--runsLeft == 0) {
      app.close();
      console.log("-- ALL TESTS PASSED, exiting.");
    }
  };
  
  webdriverUtils.runTests(subdirname, desired, function(err, info) {
    assert(!err);
    assert.equal(info.result.passed, 503);
    assert.equal(info.result.failed, 0);
    //console.log(err, result);
    maybeQuit();
  });
  
  desired.browserName = 'firefox';
  webdriverUtils.runTests(subdirname, desired, function(err, info) {
    assert(!err);
    assert.equal(info.result.passed, 503);
    assert.equal(info.result.failed, 0);
    //console.log(err, result);
    maybeQuit();
  });
});
