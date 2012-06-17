var app = require('./app'),
    config = require('./config'),
    http = require('http');

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
    console.log('POST returned', res.statusCode);
    res.setEncoding('utf8');
    res.on('data', function(data) {
      console.log('POST response body: ' + data);
    });
  });
  req.write(payload);
  req.end();

  app.on('webdriver-session-finished', function(info) {
    console.log("test finished", info);
    if (app.activeJobs == 0)
      app.close();
  });
});

// Based on https://help.github.com/articles/post-receive-hooks
var githubPayload = {payload: JSON.stringify({
  "before": "f3a0d8e1eee22ce850f2b01e2696d8c53f9abddc",
  "repository": {
    "url": "http://github.com/toolness/slowparse",
    "name": "slowparse",
    "description": "A slow JS-based HTML parser with good error feedback and debugging metadata.",
    "watchers": 5,
    "forks": 2,
    "private": 1,
    "owner": {
      "email": "chris@ozmm.org",
      "name": "toolness"
    }
  },
  "commits": [
    {
      "id": "a33cce14c378cd9f78db3f6a4f9555a72931bfe2",
      "url": "http://github.com/toolness/slowparse/commit/a33cce14c378cd9f78db3f6a4f9555a72931bfe2",
      "author": {
        "email": "chris@ozmm.org",
        "name": "Chris Wanstrath"
      },
      "message": "Merge pull request #40 from Pomax/gh-pages ",
      "timestamp": "2008-02-15T14:57:17-08:00",
      "added": ["filepath.rb"]
    },
    {
      "id": "cb46ad1113726c656b1f78cc226f975a389bf86a",
      "url": "http://github.com/toolness/slowparse/commit/cb46ad1113726c656b1f78cc226f975a389bf86a",
      "author": {
        "email": "chris@ozmm.org",
        "name": "Chris Wanstrath"
      },
      "message": "add optional external reporter script injection in test suite. ",
      "timestamp": "2008-02-15T14:36:34-08:00"
    }
  ],
  "after": "cb46ad1113726c656b1f78cc226f975a389bf86a",
  "ref": "refs/heads/gh-pages"
})};
