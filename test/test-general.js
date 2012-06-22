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
  var wdu = require('../webdriver-utils');
  
  it('should return a string', function() {
    var js = wdu.getInjectionJS();
    
    assert.equal(typeof(js), "string");
  });
  
  it('should be valid JS', function() {
    var vm = require('vm');
    vm.runInNewContext(wdu.getInjectionJS(), {
      QUnit: {},
      setInterval: function() {}
    }, 'externalreporter.js');
  });
});
