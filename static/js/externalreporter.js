// This file is injected by any QUnit test suite that needs to
// integrate with simplesauce.

(function() {
  var results = null;

  QUnit.done = function(r) {
    results = r;
    maybeFinish();
  };

  function maybeFinish() {
    if (results && window.WEBDRIVER_CB) {
      clearInterval(interval);
      window.WEBDRIVER_CB(JSON.stringify(results));
    }
  }

  var interval = setInterval(maybeFinish, 10);
})();
