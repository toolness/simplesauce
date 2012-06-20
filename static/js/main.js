var BROWSER_NAMES = {
  iexplore: "Internet Explorer",
  opera: "Opera",
  firefox: "Firefox",
  chrome: "Chrome"
};

function text(string) {
  return $(document.createTextNode(string));
}

function showLog(log) {
  var commit = null;
  
  $("#entries").empty();
  log.entries.forEach(function(entry) {
    var caps = entry.capabilities;
    var data = caps['custom-data'];
    var shortname = data.repository.split("github.com/")[1];
    var shortcommit = data.commit.slice(0, 7);
    var shortid = shortname + "@" + shortcommit;

    if (!(commit && commit.attr("data-shortid") == shortid)) {
      commit = $('<div class="commit"></div>')
        .attr("data-shortid", shortid)
        .appendTo("#entries");
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

$("#show-submit-job-form").click(function() {
  $("#submit-job").slideDown();
  return false;
});

$("#submit-job").submit(function() {
  var commitRE = /^https?:\/\/github\.com\/(.+)\/(.+)\/commit\/([0-9a-f]+)$/;
  try {
    var commitURL = $("#commit-url").val();
    var postEndpoint = $("#post-endpoint").val();
    var match = commitURL.match(commitRE);

    if (!match) {
      alert("Invalid commit URL!");
      return false;
    }

    var username = match[1];
    var reponame = match[2];
    var commit = match[3];

    // Based on https://help.github.com/articles/post-receive-hooks
    var githubPayload = {payload: JSON.stringify({
      "repository": {
        "url": "http://github.com/" + username + "/" + reponame,
        "name": reponame,
        "description": "manually submitted job",
        "owner": {
          "name": username
        }
      },
      "commits": [],
      "after": commit,
      "ref": "refs/heads/UNKNOWN"
    })};
    jQuery.ajax({
      type: 'POST',
      url: postEndpoint,
      data: JSON.stringify(githubPayload),
      error: function() {
        alert('Alas, an error occurred.');
      },
      success: function(data) {
        if (window.console)
          console.log(data);
        refreshData();
      },
      dataType: 'text',
      contentType: 'application/json'
    });
    $(this).slideUp();
  } catch (e) {
    if (window.console)
      console.error(e);
  }
  
  return false;
});

$(window).ready(function() {
  var REFRESH_DATA_INTERVAL = 60000;
  var statusRequest = null;
  var logRequest = null;

  var refreshData = window.refreshData = function() {
    if (statusRequest)
      statusRequest.abort();
    statusRequest = jQuery.getJSON('/status', function(info) {
      statusRequest = null;
      var activeJobs = info.activeJobs == 0 ? "no" : info.activeJobs;
      $(".active-jobs").text(activeJobs);
    });

    if (logRequest)
      logRequest.abort();
    if (window.location.search == "?sampledata=1")
      logRequest = jQuery.getScript("js/sample-log.js", function() {
        logRequest = null;
        showLog(SAMPLE_LOG);
      });
    else
      logRequest = jQuery.get("log.json", function(log) {
        logRequest = null;
        showLog(log);
      });
  }

  setInterval(refreshData, REFRESH_DATA_INTERVAL);
  refreshData();
});
