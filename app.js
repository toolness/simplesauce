var webdriverUtils = require('./webdriver-utils'),
    express = require('express'),
    fs = require('fs'),
    os = require('os'),
    config = require('./config'),
    tarball = require('./tarball'),
    app = express.createServer(),
    staticFilesDir = __dirname + '/static';

const DEFAULT_AUTOMATION = {
  "capabilities": [
    {
      "browserName": "firefox"
    }
  ]
};

app.use(express.bodyParser());
app.post(config.postReceiveEndpoint, function(req, res) {
  var info = req.body.payload;
  var account = info.repository.owner.name;
  var name = info.repository.name;
  var commit = info.after;
  var tarballURL = "https://github.com/" + account + "/" + name +
                   "/tarball/" + commit;

  console.log("extracting tarball", tarballURL);
  tarball.extract(tarballURL, staticFilesDir, function(err) {
    var subdirname = account + '-' + name + '-' + commit.slice(0, 7);
    var jsonFilename = staticFilesDir + '/' + subdirname +
                       '/test/automation.json';
    console.log('tarball retrieved, running tests on', subdirname);
    if (!err) {
      var automation;
      try {
        automation = JSON.parse(fs.readFileSync(jsonFilename));
      } catch (e) {
        console.log('retrieving test/automation.json failed, using default.');
        automation = JSON.parse(JSON.stringify(DEFAULT_AUTOMATION));
      }
      automation.capabilities.forEach(function(desired) {
        console.log('running tests on', JSON.stringify(desired));
        Object.keys(config.capabilities).forEach(function(name) {
          desired[name] = config.capabilities[name];
        });
        desired.tags = [account, name];
        desired.name = 'automatic tests for ' + name + ', ' +
                       info.repository.description;
        if (typeof(desired['custom-data']) != 'object')
          desired['custom-data'] = {};
        desired['custom-data'].repository = info.repository.url;
        desired['custom-data'].commit = commit;
        desired['custom-data'].branch = info.ref.split('/').reverse()[0];
        app.emit('webdriver-session-starting', {
          capabilities: desired
        });
        webdriverUtils.runTests(subdirname, desired, function(err, result) {
          if (!err)
            app.emit('webdriver-session-finished', result);
        });
      });
      res.send('started tests on ' + automation.capabilities.length +
               ' browser(s).');
    } else {
      res.send('could not retrieve tarball at ' + tarballURL, 400);
    }
  });
});

app.get('/externalreporter.js', function(req, res) {
  res.send(webdriverUtils.getInjectionJS());
});

app.use(express.static(staticFilesDir));

module.exports = app;

app.autoListen = function(cb) {
  app.listen(config.port, config.hostname, cb);
};

if (!module.parent) {
  console.log("listening on", config.hostname + ":" + config.port);
  app.autoListen(function() {
    console.log("serving on port " + config.port);
  });
}
