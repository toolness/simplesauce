var assert = require('assert');

describe('config', function() {
  var config = require('../config');

  it('should have a valid baseURL', function() {
    assert.equal(config.baseURL.indexOf("http"), 0);
  });
});

describe('app', function() {
  it('should be importable', function() {
    require('../app');
  });
});

describe('webdriver-utils.getInjectionJS()', function() {
  var wdu = require('../webdriver-utils'),
      vm = require('vm');
  
  it('should return a string', function() {
    var js = wdu.getInjectionJS();
    
    assert.equal(typeof(js), "string");
  });
  
  it('should be valid JS', function() {
    vm.runInNewContext(wdu.getInjectionJS(), {
      QUnit: {},
      setInterval: function() {}
    }, 'externalreporter.js');
  });

  it('should continuously report back', function() {
    var intervalCallbacks = {};
    var id = 0;
    var timesWebdriverCallbackCalled = 0;
    var sandbox = {
      QUnit: {},
      window: {},
      setInterval: function(fn, interval) {
        intervalCallbacks[id] = fn;
        return id++;
      },
      clearInterval: function(id) {
        delete intervalCallbacks[id];
      }
    };
    
    function numIntervalCallbacks() {
      return Object.keys(intervalCallbacks).length;
    }

    function windowHasWEBDRIVER_CB() {
      return ("WEBDRIVER_CB" in sandbox.window);
    }
    
    vm.runInNewContext(wdu.getInjectionJS(), sandbox, 'externalreporter.js');
    assert.equal(numIntervalCallbacks(), 1);
    sandbox.QUnit.log("yo");
    sandbox.QUnit.log("dawg");
    intervalCallbacks[0]();
    assert.equal(numIntervalCallbacks(), 1);

    sandbox.window.WEBDRIVER_CB = function(results) {
      timesWebdriverCallbackCalled++;
      assert.deepEqual(JSON.parse(results), [
        {type: "log", value: "yo"},
        {type: "log", value: "dawg"}
      ]);
    };

    assert(windowHasWEBDRIVER_CB());
    intervalCallbacks[0]();
    assert(!windowHasWEBDRIVER_CB());
    assert.equal(timesWebdriverCallbackCalled, 1);
    assert.equal(numIntervalCallbacks(), 1);

    sandbox.window.WEBDRIVER_CB = function(results) {
      timesWebdriverCallbackCalled++;
      assert.deepEqual(JSON.parse(results), [
        {type: "done", value: "BYE"}
      ]);
    };

    sandbox.QUnit.done("BYE");
    assert.equal(timesWebdriverCallbackCalled, 2);
    assert(!windowHasWEBDRIVER_CB());
    assert.equal(numIntervalCallbacks(), 0);
  });
});
