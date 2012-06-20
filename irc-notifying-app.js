var irc = require('irc'),
    app = require('./app'),
    config = require('./config');

var BROWSER_NAMES = {
  iexplore: "Internet Explorer",
  opera: "Opera",
  firefox: "Firefox",
  chrome: "Chrome"
};

var client = new irc.Client(config.irc.server, config.irc.username, {
    channels: Object.keys(config.irc.channels)
});

function say(name, msg) {
  try {
    Object.keys(config.irc.channels).forEach(function(channel) {
      config.irc.channels[channel].forEach(function(project) {
        if (project == name)
          client.say(channel, msg);
      });
    });
  } catch (e) {
    console.log("failed to broadcast on IRC: " + e);
  }
}

app.on("job-submitted", function(info) {
  var shortname = info.account + "/" + info.name + "@" +
      info.commit.slice(0, 7);
  say(info.name,
      "tests for " + shortname + " (branch " + info.branch + ") " +
      "started on " + info.capabilities.length + " browsers. " +
      "For detailed results, see " + config.baseURL + ".");
});

app.on("webdriver-session-finished", function(entry) {
  var caps = entry.capabilities;
  var name = caps['custom-data'].repository.split('/').reverse()[0];
  var browserName = BROWSER_NAMES[caps.browserName] +
                    (caps.version ? ' ' + caps.version : '');
  if (entry.result) {
    say(name, entry.result.passed + " of " + entry.result.total +
        " tests passed on " + browserName + ".");
  } else
    say(name, "All tests failed on " + browserName + ".");
});

app.autoListen();
