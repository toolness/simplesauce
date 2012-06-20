var webdriverUtils = require('./webdriver-utils'),
    express = require('express'),
    fs = require('fs'),
    os = require('os'),
    config = require('./config'),
    git = require('./git'),
    _ = require('./underscore.js'),
    app = express.createServer(),
    staticFilesDir = __dirname + '/static';

var BROWSER_CAPS = {
  firefox: {
    "browserName": "firefox"
  },
  chrome: {
    "browserName": "chrome"
  },
  ie9: {
    browserName: 'iexplore',
    version: '9',
    platform: 'Windows 2008'
  }
};

var DEFAULT_PROJECT_CONFIG = {
  browsers: ["firefox", "chrome"],
  testPath: "/test/"
};

if (config.sauce)
  DEFAULT_PROJECT_CONFIG.browsers.push("ie9");

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
  var branch = info.ref.split('/').reverse()[0];
  
  console.log("cloning git repository", gitURL);
  git.clone(gitURL, subdirpath, commit, function(err) {
    var jsonFilename = subdirpath + '/.simplesauce.json';
    console.log('repository cloned, running tests on', subdirname);
    if (!err) {
      var projectConfig = _.clone(DEFAULT_PROJECT_CONFIG);
      try {
        _.extend(projectConfig, JSON.parse(fs.readFileSync(jsonFilename)));
      } catch (e) {
        console.log('retrieving .simplesauce.json failed, using defaults.');
      }
      var capabilities = [];
      projectConfig.browsers.forEach(function(browser) {
        if (browser in BROWSER_CAPS)
          capabilities.push(_.clone(BROWSER_CAPS[browser]));
        else
          console.warn("browser '" + browser + "' is unknown.");
      });
      app.emit('job-submitted', {
        account: account,
        name: name,
        commit: commit,
        branch: branch,
        capabilities: capabilities
      });
      capabilities.forEach(function(desired) {
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
        desired['custom-data'].branch = branch;
        app.activeJobs++;
        app.emit('webdriver-session-starting', {
          capabilities: desired
        });
        webdriverUtils.runTests(subdirname, desired, function(err, result) {
          app.activeJobs--;
          app.emit('webdriver-session-finished', result);
        }, projectConfig.testPath);
      });
      res.send('started tests on ' + capabilities.length + ' browser(s).');
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
