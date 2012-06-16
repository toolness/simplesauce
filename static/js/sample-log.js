var SAMPLE_LOG = {
  entries: [
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
      }
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
      }
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
      }
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
      }
    }
  ]
};
