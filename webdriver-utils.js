var webdriver = require('wd'),
    config = require('./config'),
    http = require('http');

const WEBDRIVER_CB_CODE = "window.WEBDRIVER_CB = " +
                          "arguments[arguments.length-1];";

exports.getInjectionJS = function getInjectionJS() {
  function injectReporter() {
    var results = null;
    
    QUnit.done = function(r) {
      results = r;
      maybeFinish();
    };
    
    function maybeFinish() {
      if (results && window.WEBDRIVER_CB) {
        clearInterval(interval);
        window.WEBDRIVER_CB(JSON.stringify(results));
      }
    }
    
    var interval = setInterval(maybeFinish, 10);
  }
  
  return '(' + injectReporter + ')();';
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

exports.runTests = function runTests(subdirname, desired, cb) {
  var desired = JSON.parse(JSON.stringify(desired));
  var baseurl = "http://" + config.hostname + ":" +
                config.port + "/" + subdirname + "/test/",
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
  
  browser.init(desired, function(err, sessionID) {
    console.log("session ID is", sessionID);
    browser.get(url, function() {
      browser.setAsyncScriptTimeout(50000, function(err) {
        browser.executeAsync(WEBDRIVER_CB_CODE, [], function(err, result) {
          result = JSON.parse(result);
          console.log("browser.executeAsync() returned", err, result);
          desired.passed = (result.failed == 0);
          if (typeof(desired['custom-data']) != 'object')
            desired['custom-data'] = {};
          desired['custom-data']['tests-url'] = baseurl;
          Object.keys(result).forEach(function(name) {
            desired['custom-data']['tests-' + name] = result[name];
          });
          if (config.sauce)
            updateSauceJob(config.sauce, sessionID, desired);
          cb(null, {
            sessionID: sessionID,
            capabilities: desired,
            result: result
          });
          browser.quit();
        });
      });
    });
  });
}
