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
    channels: [config.irc.channel]
});

function say(msg) {
  try {
    client.say(config.irc.channel, msg);
  } catch (e) {
    console.log("failed to broadcast on IRC: " + e);
  }
}

app.on("job-submitted", function(info) {
  var shortname = info.account + "/" + info.name + "@" +
      info.commit.slice(0, 7);
  say("tests for " + shortname + " (branch " + info.branch + ") " +
      "started on " + info.capabilities.length + " browsers. " +
      "For detailed results, see " + config.baseURL + ".");
});

app.on("webdriver-session-finished", function(entry) {
  var caps = entry.capabilities;
  var browserName = BROWSER_NAMES[caps.browserName] +
                    (caps.version ? ' ' + caps.version : '');
  if (entry.result) {
    say(entry.result.passed + " of " + entry.result.total +
        " tests passed on " + browserName + ".");
  } else
    say("All tests failed on " + browserName + ".");
});

app.autoListen();
