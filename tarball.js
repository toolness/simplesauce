var spawn = require('child_process').spawn,
    config = require('./config');

exports.extract = function(url, dirname, cb) {
  var curl = spawn('curl', config.curlOptions.concat(['-L', url])),
      tar = spawn('tar', ['-zxvf', '-'], {
        cwd: dirname
      });

  curl.stdout.on('data', function(data) {
    tar.stdin.write(data);
  });

  curl.on('exit', function(code) {
    if (code !== 0) {
      console.log('CURL DIED BADLY!');
      tar.kill();
    } else
      tar.stdin.end();
  });

  tar.on('exit', function(code) {
    if (code !== 0)
      cb("FAIL");
    else
      cb(null);
  });
};
