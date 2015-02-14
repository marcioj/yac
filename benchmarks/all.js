var Benchmark = require('benchmark');
var Suite = new Benchmark.Suite;
var Class = require('../lib/class');

function printStatus(fn, fnName) {
  switch(%GetOptimizationStatus(fn)) {
    case 1: console.log(fnName, "is optimized"); break;
    case 2: console.log(fnName, "is not optimized"); break;
    case 3: console.log(fnName, "is always optimized"); break;
    case 4: console.log(fnName, "is never optimized"); break;
    case 6: console.log(fnName, "is maybe deoptimized"); break;
  }
}

console.log('================ Benchmarks ================');

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
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();

console.log('================ Optimizations ================');
// Taken from https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#1-tooling
// Class.extend
Class.extend(); // Fill type-info
Class.extend(); // 2 calls are needed to go from uninitialized -> pre-monomorphic -> monomorphic
%OptimizeFunctionOnNextCall(Class.extend);
Class.extend(); // The next call
printStatus(Class.extend, "Class.extend"); // Check

// Sub.overrideClass
var Sub = Class.extend();
Sub.overrideClass(); // Fill type-info
Sub.overrideClass(); // 2 calls are needed to go from uninitialized -> pre-monomorphic -> monomorphic
%OptimizeFunctionOnNextCall(Sub.overrideClass);
Sub.overrideClass(); // The next call
printStatus(Sub.overrideClass, "Sub.overrideClass"); // Check

