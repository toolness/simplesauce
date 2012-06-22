// This file is injected by any QUnit test suite that needs to
// integrate with simplesauce.

(function() {
  var results = null;

  ["log", "testStart", "testDone", "moduleStart", "moduleDone",
   "done"].forEach(function(type) {
     QUnit[type] = function(value) {
       addResult({type: type, value: value});
     };
  });

  function addResult(result) {
    if (!results)
      results = [];
    results.push(result);
    maybeFinish();
  }
  
  function maybeFinish() {
    if (results && window.WEBDRIVER_CB) {
      var arg = results,
          cb = window.WEBDRIVER_CB;
      delete window.WEBDRIVER_CB;
      results = null;
      if (arg[arg.length-1].type == "done")
        clearInterval(interval);
      cb(JSON.stringify(arg));
    }
  }

  var interval = setInterval(maybeFinish, 10);
})();
