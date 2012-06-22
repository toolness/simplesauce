var webdriver = require('wd'),
    config = require('./config'),
    http = require('http'),
    fs = require('fs');

const WEBDRIVER_CB_CODE = "window.WEBDRIVER_CB = " +
                          "arguments[arguments.length-1];";

exports.getInjectionJS = function getInjectionJS() {
  return fs.readFileSync(__dirname + '/static/js/externalreporter.js',
                         'utf8');
}

function updateSauceJob(sauce, sessionID, json) {
  var payload = JSON.stringify(json);
  var req = http.request({
    host: 'saucelabs.com',
    port: 80,
    auth: sauce.username + ':' + sauce.key,
    path: '/rest/v1/' + sauce.username + '/jobs/' + sessionID,
    headers: {
      // One would think this should be application/json, but text/json
      // is what they use in the example at:
      // https://saucelabs.com/docs/ondemand/additional-config
      'Content-Type': 'text/json',
      'Content-Length': payload.length.toString()
    },
    method: 'PUT'
  }, function(res) {
    console.log('Updating saucelabs job returned', res.statusCode);
  });
  req.write(payload);
  req.end();
}

exports.runTests = function runTests(options, cb) {
  var subdirname = options.subdirectoryName,
      desired = JSON.parse(JSON.stringify(options.desiredCapabilities)),
      baseurl = config.baseURL + "/" + subdirname + options.testPath,
      url = baseurl + '?externalreporter=1',
      browser;

  if (config.sauce) {
    browser = webdriver.remote("ondemand.saucelabs.com", 80,
                               config.sauce.username, config.sauce.key);
  } else {
    browser = webdriver.remote();
  }

  browser.on('status', function(info){
    console.log('\x1b[36m%s\x1b[0m', info);
  });
  browser.on('command', function(meth, path){
    console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
  });
  
  if (typeof(desired['custom-data']) != 'object')
    desired['custom-data'] = {};
  desired['custom-data']['tests-url'] = baseurl;
  
  browser.init(desired, function(err, sessionID) {
    var sessionURL = null;
    
    function fail(msg) {
      desired['custom-data'].failureReason = msg;
      desired.passed = false;
      if (!err && sessionID && config.sauce)
        updateSauceJob(config.sauce, sessionID, desired);
      cb(msg, {
        sessionID: !err && sessionID,
        sessionURL: sessionURL,
        capabilities: desired,
        result: null
      });
      try { browser.quit(); } catch(e) {}
    }
    
    if (err)
      return fail("could not initialize session");
      
    if (config.sauce)
      sessionURL = 'https://saucelabs.com/jobs/' + sessionID;
    console.log("session ID is", sessionID, "and URL is", sessionURL);
    browser.get(url, function(err) {
      if (err)
        return fail("could not load page at " + url);
      browser.setAsyncScriptTimeout(15000, function(err) {
        if (err)
          return fail("could not set async script timeout");
          
        function waitForResults(cb) {
          browser.executeAsync(WEBDRIVER_CB_CODE, [], function(err, result) {
            if (err)
              return fail("could not execute tests (or they timed out)");
            console.log("browser.executeAsync() returned", err, result);
            result = JSON.parse(result);
            cb(result);
          });
        }

        function onDone(result) {
          desired.passed = (result.failed == 0);
          Object.keys(result).forEach(function(name) {
            desired['custom-data']['tests-' + name] = result[name];
          });
          if (config.sauce)
            updateSauceJob(config.sauce, sessionID, desired);
          cb(null, {
            sessionID: sessionID,
            sessionURL: sessionURL,
            capabilities: desired,
            result: result
          });
          browser.quit();
        }
        
        function getMoreResults(results) {
          var areWeDoneYet = false;
          results.forEach(function(result) {
            if (result.type == "done") {
              areWeDoneYet = true;
              onDone(result.value);
            }
            // TODO: It'd be nice to process the log message and save
            // it to a file for further perusal.
          });
          if (!areWeDoneYet)
            waitForResults(getMoreResults);
        }
        
        waitForResults(getMoreResults);
      });
    });
  });
}
