var pkg = require('../package.json');
var childProcess = require('child_process');
var util = require('util');
// devDependencies
var babel = require('babel');
var browserify = require('browserify');
var fse = require('fs-extra');
var nodeWatch = require('node-watch');
var uglifyJS = require('uglify-js');

// CONFIG
// -----------------------------------------------
var srcDir = 'es6';
var distDir = 'dist';

// options for babel
var babelOptions = {
  sourceMap: 'inline',
  modules: 'common',
  optional: ['runtime']
};

// options for browserify
var browserifyOptions = {
  standalone: pkg.standalone,
  debug: true
};

// colors for shell - for a more complete list
// cf. http://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux
var red   = '\033[0;31m';
var green = '\033[0;32m';
var NC    = '\033[0m'; // No Color

// COMMAND INTERPRETER
// -----------------------------------------------
var command = process.argv[2];
// execute the correct function given the script
switch (command) {
  case '--watch':
    watch();
    break;
  case '--bundle':
    bundle();
    break;
  case '--uglify':
    uglify();
    break;
  case '--transpile':
    transpileAll();
    break;
}

// HELPERS
// -----------------------------------------------

// create filename from src to dist
function createTargetName(filename) {
  // replace source dir with target dir and '.es6.js' to '.js'
  return filename.replace(new RegExp('^' + srcDir), distDir).replace('.es6.js', '.js');
}

// create filename from `pck.main` to `umd` version
function getUmdName() {
  return pkg.main.replace('.js', '.umd.js');
}

// create filename from `umd` to `min` version
function getMinName() {
  return getUmdName().replace('.umd.js', '.min.js');
}

// SCRIPTS
// -----------------------------------------------

// watch source dir
function watch() {
  nodeWatch(srcDir, function(filename) {
    transpile(filename);
  });
}

// create the `.umd.js` version
function bundle() {
  var src = './' + pkg.main;
  var target = getUmdName();
  var b = browserify(src, browserifyOptions);

  try {
    b.bundle().pipe(fse.createWriteStream(target));
    // is not called at the right place - streams are async
    console.log(util.format(green + '=> "%s" successfully created' + NC, target));
  } catch(e) {
    return console.log(err.message);
  }

}

// create the `.min.js` version
function uglify() {
  var src = getUmdName();
  var target = getMinName();
  var res = uglifyJS.minify(src);

  fse.outputFile(target, res.code, function(err, res) {
    if (err) { return console.log(err.message); }

    console.log(util.format(green + '=> "%s" successfully created' + NC, target));
    // reminder
    console.log(util.format(red + '==> THINK ABOUT UPDATING VERSION [npm --help version] <==' + NC));
  });
}

// transpile all files in `srcDir`
function transpileAll() {
  var cmd = 'find ' + srcDir + ' -type f';

  childProcess.exec(cmd , function(err, stdout, stderr) {
    if (err) { console.error(err); }
    var fileList = stdout.split('\n');

    var stack = [];

    for (var i = 0; i < fileList.length; i++) {
      var file = fileList[i];
      if (!file) { continue; }

      stack.push(file);
    }

    transpile(stack.shift(), stack);
  });
}

// transpile one file or several files in serial
// @param `stack` is a workaround for babel which has some kind of leak and
// cannot transpile several files in parallel without being messy with sourceMaps.
// Using the Sync method crash the entire script each time there is an error in
// the code which is really boring when watching...
function transpile(src, stack) {
  var target = createTargetName(src);

  babel.transformFile(src, babelOptions, function (err, result) {
    if (err) { return console.log(err.codeFrame); }

    fse.outputFile(target, result.code, function(err) {
      if (err) { return console.error(err.message); }

      console.log(util.format(green + '=> "%s" successfully transpiled to "%s"' + NC, src, target));

      // next
      if (stack && stack.length) {
        transpile(stack.shift(), stack);
      }
    });
  });
}
