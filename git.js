var exec = require('child_process').exec,
    fs = require('fs');

function exists(dirname) {
  try {
    fs.statSync(dirname);
    return true;
  } catch (e) {
    return false;
  }
}

exports.clone = function(url, dirname, commit, cb) {
  if (exists(dirname)) {
    console.log('dir exists, assuming it is what we need: ' + dirname);
    setTimeout(cb, 0);
    return;
  }
  var cmd = 'git clone ' + url + ' ' + dirname + ' && ' +
            'cd ' + dirname + ' && ' +
            'git checkout ' + commit + ' && ' +
            'git submodule update --init --recursive';
  console.log("executing: " + cmd);
  exec(cmd, function(err, stdout, stderr) {
    if (err) {
      cb('exec error: ' + err);
      return;
    }
    cb(null);
  });
};
