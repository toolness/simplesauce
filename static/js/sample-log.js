var SAMPLE_LOG = {
  entries: [
    {"sessionID":"755bfe1c15274c00be7d7560204711ba","sessionURL":"https://saucelabs.com/jobs/755bfe1c15274c00be7d7560204711ba","capabilities":{"browserName":"firefox","public":true,"record-video":false,"record-screenshots":true,"capture-html":false,"tags":["toolness","slowparse"],"name":"automatic tests for slowparse, A slow JS-based HTML parser with good error feedback and debugging metadata.","custom-data":{"repository":"https://github.com/toolness/slowparse","commit":"541d71ad6cfaceceb69b73b1cc473941eb5feded","branch":"gh-pages","tests-url":"http://sauce.toolness.org/trees/toolness-slowparse-541d71ad6cfaceceb69b73b1cc473941eb5feded/test/","tests-failed":0,"tests-passed":503,"tests-total":503,"tests-runtime":1742},"passed":true},"result":{"failed":0,"passed":503,"total":503,"runtime":1742},"timestamp":"Sat Jun 16 2012 16:02:42 GMT+0000 (UTC)"},{"sessionID":"96666a1925d14616afdbecd2ab26e353","sessionURL":"https://saucelabs.com/jobs/96666a1925d14616afdbecd2ab26e353","capabilities":{"browserName":"chrome","public":true,"record-video":false,"record-screenshots":true,"capture-html":false,"tags":["toolness","slowparse"],"name":"automatic tests for slowparse, A slow JS-based HTML parser with good error feedback and debugging metadata.","custom-data":{"repository":"https://github.com/toolness/slowparse","commit":"541d71ad6cfaceceb69b73b1cc473941eb5feded","branch":"gh-pages","tests-url":"http://sauce.toolness.org/trees/toolness-slowparse-541d71ad6cfaceceb69b73b1cc473941eb5feded/test/","tests-failed":0,"tests-passed":503,"tests-total":503,"tests-runtime":1280},"passed":true},"result":{"failed":0,"passed":503,"total":503,"runtime":1280},"timestamp":"Sat Jun 16 2012 16:02:39 GMT+0000 (UTC)"},{"sessionID":"89aea949cec0499bac80981716014004","sessionURL":"https://saucelabs.com/jobs/89aea949cec0499bac80981716014004","capabilities":{"browserName":"iexplore","version":"9","platform":"Windows 2008","public":true,"record-video":false,"record-screenshots":true,"capture-html":false,"tags":["toolness","slowparse"],"name":"automatic tests for slowparse, A slow JS-based HTML parser with good error feedback and debugging metadata.","custom-data":{"repository":"https://github.com/toolness/slowparse","commit":"541d71ad6cfaceceb69b73b1cc473941eb5feded","branch":"gh-pages","tests-url":"http://sauce.toolness.org/trees/toolness-slowparse-541d71ad6cfaceceb69b73b1cc473941eb5feded/test/","tests-failed":0,"tests-passed":503,"tests-total":503,"tests-runtime":1701},"passed":true},"result":{"failed":0,"passed":503,"total":503,"runtime":1701},"timestamp":"Sat Jun 16 2012 16:02:38 GMT+0000 (UTC)"},
    {
      capabilities: {
        browserName: "firefox",
        passed: false,
        'custom-data': {
          repository: 'http://github.com/toolness/slowparse',
          commit: "cb46ad1113726c656b1f78cc226f975a389bf86a",
          'tests-url': '/run-the-tests',
          failureReason: 'could not initialize session'
        }
      },
      "timestamp":"Sat Jun 16 2012 16:02:42 GMT+0000 (UTC)"
    },
    {
      sessionURL: "https://saucelabs.com/jobs/blah",
      result: {
        passed: 503,
        failed: 0,
        total: 503,
        runtime: 512
      },
      capabilities: {
        browserName: "iexplore",
        version: 9,
        passed: true,
        'custom-data': {
          repository: 'http://github.com/toolness/slowparse',
          commit: "cb46ad1113726c656b1f78cc226f975a389bf86a",
          'tests-url': '/run-the-tests'
        }
      },
      "timestamp":"Sat Jun 16 2012 16:02:42 GMT+0000 (UTC)"
    },
    {
      sessionURL: "https://saucelabs.com/jobs/blah",
      capabilities: {
        browserName: "opera",
        passed: false,
        'custom-data': {
          repository: 'http://github.com/toolness/slowparse',
          commit: "cb46ad1113726c656b1f78cc226f975a389bf86a",
          'tests-url': '/run-the-tests'
        }
      },
      "timestamp":"Sat Jun 16 2012 16:02:42 GMT+0000 (UTC)"
    },
    {
      sessionURL: "https://saucelabs.com/jobs/blah",
      result: {
        passed: 503,
        failed: 0,
        total: 503,
        runtime: 512
      },
      capabilities: {
        browserName: "chrome",
        passed: true,
        'custom-data': {
          repository: 'http://github.com/toolness/slowparse',
          commit: "cb46ad1113726c656b1f78cc226f975a389bf86a",
          'tests-url': '/run-the-tests'
        }
      },
      "timestamp":"Sat Jun 16 2012 16:02:42 GMT+0000 (UTC)"
    }
  ]
};
