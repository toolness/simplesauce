var app = require('../../app'),
    config = require('../../config'),
    http = require('http'),
    assert = require('assert');

app.autoListen(function() {
  var payload = JSON.stringify(githubPayload);
  var req = http.request({
    host: config.hostname,
    port: config.port,
    path: config.postReceiveEndpoint,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length.toString()
    },
    method: 'POST'
  }, function(res) {
    assert.equal(res.statusCode, 200);
    res.setEncoding('utf8');
    res.on('data', function(data) {
      assert.equal(data.indexOf('started tests'), 0);
    });
  });
  req.write(payload);
  req.end();

  app.on('webdriver-session-finished', function(info) {
    assert.equal(info.result.passed, 1);
    assert.equal(info.result.failed, 0);
    //console.log("test finished", info);
    if (app.activeJobs == 0) {
      app.close();
      console.log("-- ALL TESTS PASSED, exiting.");
    }
  });
});

// Based on https://help.github.com/articles/post-receive-hooks
var githubPayload = {payload: JSON.stringify({ "after": "94f0a5de33a459cab6af183a832327896d4d0f8f", "before": "440374faba56c41d4575bc1f2e9df81f7611c97a", "commits": [ { "added": [ "static/js/show-log.js" ], "author": { "email": "varmaa@gmail.com", "name": "Atul Varma", "username": "toolness" }, "committer": { "email": "varmaa@gmail.com", "name": "Atul Varma", "username": "toolness" }, "distinct": true, "id": "25b95f8b4eb1b596be2a9bfb32340249961c2335", "message": "Split out log-related code into js/show-log.js.", "modified": [ "static/index.html", "static/js/main.js" ], "removed": [], "timestamp": "2012-06-20T13:06:29-07:00", "url": "https://github.com/toolness/simplesauce/commit/25b95f8b4eb1b596be2a9bfb32340249961c2335" }, { "added": [ "underscore.js" ], "author": { "email": "varmaa@gmail.com", "name": "Atul Varma", "username": "toolness" }, "committer": { "email": "varmaa@gmail.com", "name": "Atul Varma", "username": "toolness" }, "distinct": true, "id": "03bbdedff0360584822ba2763cb322f6763d48f6", "message": "Use .simplesauce.json for per-project config.", "modified": [ "app.js", "webdriver-utils.js" ], "removed": [], "timestamp": "2012-06-20T13:31:02-07:00", "url": "https://github.com/toolness/simplesauce/commit/03bbdedff0360584822ba2763cb322f6763d48f6" }, { "added": [ ".simplesauce.json", "static/test/index.html", "static/test/qunit.css", "static/test/qunit.js" ], "author": { "email": "varmaa@gmail.com", "name": "Atul Varma", "username": "toolness" }, "committer": { "email": "varmaa@gmail.com", "name": "Atul Varma", "username": "toolness" }, "distinct": true, "id": "94f0a5de33a459cab6af183a832327896d4d0f8f", "message": "added simple qunit test suite", "modified": [], "removed": [], "timestamp": "2012-06-20T13:34:05-07:00", "url": "https://github.com/toolness/simplesauce/commit/94f0a5de33a459cab6af183a832327896d4d0f8f" } ], "compare": "https://github.com/toolness/simplesauce/compare/440374faba56...94f0a5de33a4", "created": false, "deleted": false, "forced": false, "head_commit": { "added": [ ".simplesauce.json", "static/test/index.html", "static/test/qunit.css", "static/test/qunit.js" ], "author": { "email": "varmaa@gmail.com", "name": "Atul Varma", "username": "toolness" }, "committer": { "email": "varmaa@gmail.com", "name": "Atul Varma", "username": "toolness" }, "distinct": true, "id": "94f0a5de33a459cab6af183a832327896d4d0f8f", "message": "added simple qunit test suite", "modified": [], "removed": [], "timestamp": "2012-06-20T13:34:05-07:00", "url": "https://github.com/toolness/simplesauce/commit/94f0a5de33a459cab6af183a832327896d4d0f8f" }, "pusher": { "name": "none" }, "ref": "refs/heads/master", "repository": { "created_at": "2012-06-18T07:20:20-07:00", "description": "Simple webdriver/saucelabs CI for static HTML5 projects.", "fork": false, "forks": 1, "has_downloads": true, "has_issues": true, "has_wiki": true, "homepage": "http://sauce.toolness.org/", "language": "JavaScript", "name": "simplesauce", "open_issues": 1, "owner": { "email": "varmaa@gmail.com", "name": "toolness" }, "private": false, "pushed_at": "2012-06-20T13:34:52-07:00", "size": 240, "url": "https://github.com/toolness/simplesauce", "watchers": 1 } })};
