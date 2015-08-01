var browserify = require("broccoli-browserify");
var mergeTrees = require("broccoli-merge-trees");
var uglify = require("broccoli-uglify-js");
var funnel = require("broccoli-funnel");
var env = require("broccoli-env").getEnv();

var dev = env === "development";

var sourceCodeTree = funnel("lib", {
  srcDir: "/",
  destDir: "/lib"
});

if (dev) {

  var testTree = funnel("test", {
    srcDir: "/",
    destDir: "/test"
  });

  var testIndexTree = funnel("test", {
    srcDir: "/",
    files: ["test.html"],
    destDir: "/"
  });

  var mochaTree = funnel("node_modules", {
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

  var appTree = browserify(sourceCodeTree, {
    entries: ["./lib/class"],
    bundle: { standalone: "Class" },
    outputFile: "class.js"
  });

  var minifiedTree = uglify(appTree);

  var minifiedTree = funnel(minifiedTree, {
    srcDir: "class.js",
    destDir: "class.min.js"
  });

  module.exports = mergeTrees([appTree, minifiedTree]);
}
