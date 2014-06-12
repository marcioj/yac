"use strict";

var Class = require("../lib/class");
var expect = require("chai").expect;

describe("Class", function() {
  it("exists", function() {
    expect(Class).to.exist;
  });

  it(".extend generate a new instance", function() {
    var Sub = Class.extend({
      foo: "bar",
      hello: function() {
        return "world";
      }
    });
    var sub = new Sub();
    expect(sub.foo).to.equal("bar");
    expect(sub.hello()).to.equal("world");
  });

  it("change properties without affect other instances", function() {
    var Sub = Class.extend({
      foo: "bar",
      hello: function() {
        return "world";
      }
    });
    var sub = new Sub();
    expect(sub.foo).to.equal("bar");

    sub.foo = "my bar";
    var otherSub = new Sub();

    expect(otherSub.foo).to.equal("bar");
    expect(sub.foo).to.equal("my bar");
  });

  it("change properties without affect other instances", function() {
    var Sub = Class.extend({
      foo: "bar",
      hello: function() {
        return "world";
      }
    });
    var sub = new Sub();
    expect(sub.foo).to.equal("bar");

    sub.foo = "my bar";
    var otherSub = new Sub();

    expect(otherSub.foo).to.equal("bar");
    expect(sub.foo).to.equal("my bar");
  });

  it("call init when a new instance is created", function() {
    var args;
    var times = 0;
    var Sub = Class.extend({
      init: function() {
        times++;
        args = Array.prototype.slice.call(arguments);
      }
    });
    new Sub();

    expect(times).to.equal(1);
    expect(args).to.deep.equal([]);

    new Sub(1, 2, 3);

    expect(times).to.equal(2);
    expect(args).to.deep.equal([1, 2, 3]);
  });
});
