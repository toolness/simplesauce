var config = require('../../config'),
    app = require('../../app'),
    webdriverUtils = require('../../webdriver-utils'),
    assert = require('assert'),
    fs = require('fs'),
    path = require('path');

const DEFAULT_SUBDIRNAME = 'trees/toolness-simplesauce-94f0a5de33a459cab6af183a832327896d4d0f8f';
var subdirname = DEFAULT_SUBDIRNAME;
var absSubdirname = null;
var testPath = app.DEFAULT_PROJECT_CONFIG.testPath;

(function processCmdLineArgs() {
  if (process.argv.length >= 3) {
    subdirname = process.argv[2];
    var subdirMatch = subdirname.match(/^.*trees\/([^\/]+)[\/]?/);
    if (subdirMatch)
      subdirname = 'trees/' + subdirMatch[1];
  }

  absSubdirname = path.normalize(__dirname + '/../../static/' + subdirname);

  try {
    fs.statSync(absSubdirname);
  } catch (e) {
    console.log('Subdirectory does not exist: ' + absSubdirname);
    console.log("Please provide a valid one through the command line.");
    process.exit(1);
  }

  var config = "{}";
  try {
    config = fs.readFileSync(absSubdirname + '/.simplesauce.json');
  } catch (e) {}
  config = JSON.parse(config);
  testPath = config.testPath || testPath;
})();

app.autoListen(function() {
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
  
  function start(desired, cb) {
    webdriverUtils.runTests({
      desiredCapabilities: desired,
      subdirectoryName: subdirname,
      testPath: testPath,
      logFilename: absSubdirname + "/log-{{sessionID}}.json"
    }, cb);
  }
  
  start(desired, function(err, info) {
    assert(!err);
    assert(info.result.passed > 0);
    assert.equal(info.result.failed, 0);
    //console.log(err, result);
    maybeQuit();
  });
  
  desired.browserName = 'firefox';
  start(desired, function(err, info) {
    assert(!err);
    assert(info.result.passed > 0);
    assert.equal(info.result.failed, 0);
    //console.log(err, result);
    maybeQuit();
  });
});
