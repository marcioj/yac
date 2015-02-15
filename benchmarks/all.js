var Benchmark = require('benchmark');
var Suite = new Benchmark.Suite;
var Class = require('../lib/class');

console.log('================ Benchmarks ================');

var Base = Class.extend();
var Parent = Class.extend({
  say: function(msg) {
    return "Parent says: " + msg;
  }
});
var Child = Parent.extend({
  say: function(msg) {
    return this._super(msg) + "\n" + "Child says: " + msg;
  }
});
var parent = new Parent();
var child = new Child();

Suite
  .add('Class.extend no args', function () {
    Class.extend();
  })
  .add('Class.extend one arg', function () {
    var Base = { foo: "foo" };
    Class.extend(Base);
  })
  .add('Class.extend two args', function () {
    var Base = { foo: "foo" };
    var Other = { bar: "bar" };
    Class.extend(Base, Other);
  })
  .add('Sub.overrideClass no args', function () {
    var Sub = Class.extend();
    Sub.overrideClass();
  })
  .add('Sub.overrideClass one arg', function () {
    var Sub = Class.extend();
    var Base = { foo: "foo" };
    Sub.overrideClass(Base);
  })
  .add('Sub.overrideClass two args', function () {
    var Sub = Class.extend();
    var Base = { foo: "foo" };
    var Other = { bar: "bar" };
    Sub.overrideClass(Base, Other);
  })
  .add('new Base() no args', function () {
    new Base();
  })
  .add('new Base() one arg', function () {
    new Base(1);
  })
  .add('new Base() two args', function () {
    new Base(1, {});
  })
  .add('parent.say() no args', function () {
    parent.say();
  })
  .add('parent.say() one arg', function () {
    parent.say("hello");
  })
  .add('child.say() no args', function () {
    child.say();
  })
  .add('child.say() one arg', function () {
    child.say("hello");
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();

console.log('================ Optimizations ================');

function printStatus(fn, fnName) {
  switch(%GetOptimizationStatus(fn)) {
    case 1: console.log(fnName, "is optimized"); break;
    case 2: console.log(fnName, "is not optimized"); break;
    case 3: console.log(fnName, "is always optimized"); break;
    case 4: console.log(fnName, "is never optimized"); break;
    case 6: console.log(fnName, "is maybe deoptimized"); break;
  }
}

printStatus(Class.extend, "Class.extend");

// Sub.overrideClass
var Sub = Class.extend();
Sub.overrideClass(); // Fill type-info
Sub.overrideClass(); // 2 calls are needed to go from uninitialized -> pre-monomorphic -> monomorphic
%OptimizeFunctionOnNextCall(Sub.overrideClass);
Sub.overrideClass(); // The next call
printStatus(Sub.overrideClass, "Sub.overrideClass"); // Check

printStatus(Base, "Base");
printStatus(parent.say, "parent.say");
printStatus(child.say, "child.say");

