var showLog = (function() {
  var BROWSER_NAMES = {
    iexplore: "Internet Explorer",
    opera: "Opera",
    firefox: "Firefox",
    chrome: "Chrome"
  };

  function text(string) {
    return $(document.createTextNode(string));
  }

  return function showLog(log, entries) {
    var commit = null;

    entries.empty();
    log.entries.forEach(function(entry) {
      var caps = entry.capabilities;
      var data = caps['custom-data'];
      var shortname = data.repository.split("github.com/")[1];
      var shortcommit = data.commit.slice(0, 7);
      var shortid = shortname + "@" + shortcommit;

      if (!(commit && commit.attr("data-shortid") == shortid)) {
        commit = $('<div class="commit"></div>')
          .attr("data-shortid", shortid)
          .appendTo(entries);
        var commitInfo = $('<div class="commit-info"></div>').appendTo(commit);
        $('<a class="shortname"></a>')
          .text(shortname)
          .attr("href", data.repository)
          .appendTo(commitInfo);
        text(" @ ").appendTo(commitInfo);
        $('<a class="shortcommit"></a>')
          .text(shortcommit)
          .attr("href", data.repository + "/commit/" + data.commit)
          .appendTo(commitInfo);

        var timestamp = entry.timestamp.split("GMT")[0];
        $('<time></time>').text(timestamp).appendTo(commitInfo);
      }
      var div = $('<div class="job"></div>').appendTo(commit);
      if (caps.passed)
        div.addClass("pass");
      else
        div.addClass("fail");
      if (entry.result) {
        $('<span class="results">' + entry.result.passed + ' of ' +
          entry.result.total + ' <a class="tests">tests</a> pass in ' +
          entry.result.runtime + 'ms</span>').appendTo(div);
      } else {
        $('<span>All <a class="tests">tests</a> fail</span>')
          .appendTo(div);
      }
      text(" on ").appendTo(div);
      $('<span class="browser"></span>')
        .text(BROWSER_NAMES[caps.browserName] +
              (caps.version ? ' ' + caps.version : ''))
        .appendTo(div);
      div.addClass("browser-" + caps.browserName);
      text(". ").appendTo(div);
      if (entry.sessionURL) {
        $('<a class="more">more&hellip;</a>')
          .attr("href", entry.sessionURL)
          .appendTo(div);
      }
      if (!caps.passed && data.failureReason) {
        $('<div class="failure-reason"></div>')
          .text(data.failureReason)
          .appendTo(div);
      }
      div.find('a.tests').attr("href", data['tests-url']);
    });
  }
})();
