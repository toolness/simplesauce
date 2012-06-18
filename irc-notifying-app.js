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

client.on("join", function() {
  function say(msg) {
    client.say(config.irc.channel, msg);
  }
  
  //client.say(config.irc.channel, "testing makes us stronger!");
  app.on("job-submitted", function(info) {
    var shortname = info.account + "/" + info.name + "@" +
        info.commit.slice(0, 7);
    say("tests for " + shortname +
        " started on " + info.capabilities.length + " browsers. " +
        "For detailed results, see " + config.baseURL + ".");
  });
  
  app.on("webdriver-session-finished", function(entry) {
    var caps = entry.capabilities;
    var browserName = BROWSER_NAMES[caps.browserName] +
                      (caps.version ? ' ' + caps.version : '')
    if (entry.result) {
      say(entry.result.passed + " of " + entry.result.total +
          " tests passed on " + browserName + ".");
    } else
      say("All tests failed on " + browserName + ".");
  });
});

app.autoListen();
