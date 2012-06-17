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
