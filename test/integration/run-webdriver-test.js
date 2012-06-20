var config = require('../../config'),
    app = require('../../app'),
    webdriverUtils = require('../../webdriver-utils'),
    assert = require('assert');

app.autoListen(function() {
  var subdirname = 'trees/toolness-simplesauce-94f0a5de33a459cab6af183a832327896d4d0f8f';
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
    assert.equal(info.result.passed, 1);
    assert.equal(info.result.failed, 0);
    //console.log(err, result);
    maybeQuit();
  }, "/static/test/");
  
  desired.browserName = 'firefox';
  webdriverUtils.runTests(subdirname, desired, function(err, info) {
    assert(!err);
    assert.equal(info.result.passed, 1);
    assert.equal(info.result.failed, 0);
    //console.log(err, result);
    maybeQuit();
  }, "/static/test/");
});
