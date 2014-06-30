var pickFiles = require("broccoli-static-compiler");
var browserify = require("broccoli-browserify");
var mergeTrees = require("broccoli-merge-trees");
var uglify = require("broccoli-uglify-js");
var moveFile = require("broccoli-file-mover");
var env = require("broccoli-env").getEnv();

var dev = env === "development";

if (dev) {
  var sourceCodeTree = pickFiles("lib", {
    srcDir: "/",
    destDir: "/lib"
  });

  var testTree = pickFiles("test", {
    srcDir: "/",
    destDir: "/test"
  });

  var testIndexTree = pickFiles("test", {
    srcDir: "/",
    files: ["test.html"],
    destDir: "/"
  });

  var mochaTree = pickFiles("node_modules", {
    srcDir: "/mocha",
    files: ["mocha.js", "mocha.css"],
    destDir: "/"
  });

  var appTree = mergeTrees([sourceCodeTree, testTree]);

  var appTree = browserify(appTree, {
    entries: ["./test/class_test.js", "./lib/class"],
    outputFile: "bundle.js"
  });

  module.exports = mergeTrees([appTree, testIndexTree, mochaTree]);
} else {
  var sourceCodeTree = pickFiles("lib", {
    srcDir: "/",
    destDir: "/lib"
  });

  var appTree = browserify(sourceCodeTree, {
    entries: ["./lib/class"],
    bundle: { standalone: "Class" },
    outputFile: "class.js"
  });

  var minifiedTree = uglify(appTree);

  var minifiedTree = moveFile(minifiedTree, {
    srcFile: "class.js",
    destFile: "class.min.js"
  });

  module.exports = mergeTrees([appTree, minifiedTree]);
}
