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

// Taken from https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#1-tooling
// Fill type-info
Class.extend();
// 2 calls are needed to go from uninitialized -> pre-monomorphic -> monomorphic
Class.extend();

%OptimizeFunctionOnNextCall(Class.extend);
// The next call
Class.extend();

// Check
printStatus(Class.extend, "Class.extend");

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
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run();
