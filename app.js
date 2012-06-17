var webdriverUtils = require('./webdriver-utils'),
    express = require('express'),
    fs = require('fs'),
    os = require('os'),
    config = require('./config'),
    git = require('./git'),
    app = express.createServer(),
    staticFilesDir = __dirname + '/static';

var DEFAULT_AUTOMATION = {
  "capabilities": [
    {
      "browserName": "firefox"
    },
    {
      "browserName": "chrome"
    }    
  ]
};

if (config.sauce)
  DEFAULT_AUTOMATION.capabilities.push({
    browserName: 'iexplore',
    version: '9',
    platform: 'Windows 2008'
  });

app.activeJobs = 0;

app.use(express.bodyParser());
app.post(config.postReceiveEndpoint, function(req, res) {
  var info = JSON.parse(req.body.payload);
  var account = info.repository.owner.name;
  var name = info.repository.name;
  var commit = info.after;
  var gitURL = 'git://github.com/' + account + '/' + name + '.git';
  var subdirname = 'trees/' + account + '-' + name + '-' + commit;
  var subdirpath = staticFilesDir + '/' + subdirname;
  
  console.log("cloning git repository", gitURL);
  git.clone(gitURL, subdirpath, commit, function(err) {
    var jsonFilename = subdirpath + '/test/automation.json';
    console.log('repository cloned, running tests on', subdirname);
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
        app.activeJobs++;
        app.emit('webdriver-session-starting', {
          capabilities: desired
        });
        webdriverUtils.runTests(subdirname, desired, function(err, result) {
          app.activeJobs--;
          app.emit('webdriver-session-finished', result);
        });
      });
      res.send('started tests on ' + automation.capabilities.length +
               ' browser(s).');
    } else {
      res.send('could not clone git repository at ' + gitURL, 400);
    }
  });
});

app.on('webdriver-session-finished', function(info) {
  var MAX_LOG_ENTRIES = 50;
  var logfile = staticFilesDir + '/log.json';
  var log;
  try {
    log = JSON.parse(fs.readFileSync(logfile));
  } catch (e) {
    log = {entries: []};
  }
  log.entries = log.entries.slice(0, MAX_LOG_ENTRIES);
  info.timestamp = (new Date()).toString();
  log.entries.unshift(info);
  fs.writeFileSync(logfile, JSON.stringify(log));
});

app.get('/status', function(req, res) {
  res.send({
    activeJobs: app.activeJobs
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
