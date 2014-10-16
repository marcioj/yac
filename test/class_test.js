"use strict";

var Class = require("../lib/class");
var expect = require("chai").expect;

describe("Class", function() {
  it("exists", function() {
    expect(Class).to.exist;
  });

  it(".extend generate a new class", function() {
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

  it("inherits the properties from superclass", function() {
    var Animal = Class.extend({
      isAnimal: true,
      name: "override me"
    });
    var Human = Animal.extend({
      name: "human",
      isHuman: true
    });

    var animal = new Animal();
    var human = new Human();

    expect(animal.isAnimal).to.equal(true);
    expect(human.isAnimal).to.equal(true);
    expect(animal.name).to.equal("override me");
    expect(human.name).to.equal("human");
    expect(animal.isHuman).to.not.exist;
    expect(human.isHuman).to.equal(true);
    expect(animal).to.be.instanceof(Animal);
    expect(human).to.be.instanceof(Animal);
    expect(animal).to.not.be.instanceof(Human);
    expect(human).to.be.instanceof(Human);
  });

  it("calls the parent class method with _super", function() {
    var Animal = Class.extend({
      msg: function(msg) {
        return "animal says: " + msg;
      }
    });
    var Human = Animal.extend({
      msg: function(msg) {
        return "human says: " + msg + " and " + this._super(msg);
      }
    });

    var animal = new Animal();
    var human = new Human();

    expect(animal.msg("hello")).to.equal("animal says: hello");
    expect(human.msg("hello")).to.equal("human says: hello and animal says: hello");
  });

  it("calls the parent class method with _super with 2 parent classes", function() {
    var A = Class.extend({
      msg: function(msg) {
        return "a" + msg;
      }
    });
    var B = A.extend({
      msg: function(msg) {
        return "b" + this._super(msg);
      }
    });
    var C = B.extend({
      msg: function(msg) {
        return "c" + this._super(msg);
      }
    });

    var a = new A();
    var b = new B();
    var c = new C();

    expect(a.msg("x")).to.equal("ax");
    expect(b.msg("x")).to.equal("bax");
    expect(c.msg("x")).to.equal("cbax");
  });

  it("accept mixins", function() {
    var Salute = {
      say: function() {
        return "Hi " + this.name;
      }
    };
    var Foo = Class.extend(Salute, {
      name: "foo"
    });

    var foo = new Foo();
    expect(foo.say()).to.equal("Hi foo");
    foo.name = "bar";
    expect(foo.say()).to.equal("Hi bar");
  });

  it("can override mixin methods", function() {
    var Occupation = {
      say: function() {
        return "a " + this.occupation;
      }
    };
    var Salute = {
      say: function() {
        return "Hi I am " + this.name + " " + this._super();
      }
    };
    var Foo = Class.extend(Salute, Occupation, {
      name: "foo",
      occupation: "developer"
    });

    var foo = new Foo();
    expect(foo.say()).to.equal("Hi I am foo a developer");
    foo.name = "bar";
    foo.occupation = "engineer";
    expect(foo.say()).to.equal("Hi I am bar a engineer");
  });

  it("properties override mixin properties", function() {
    var Occupation = {
      occupation: "your occupation",
      say: function() {
        return "a " + this.occupation;
      }
    };
    var Salute = {
      name: "your name",
      say: function() {
        return "Hi I am " + this.name + " " + this._super();
      }
    };
    var Foo = Class.extend(Salute, Occupation, {
      name: "foo",
      occupation: "developer"
    });

    var foo = new Foo();
    expect(foo.say()).to.equal("Hi I am foo a developer");
    foo.name = "bar";
    foo.occupation = "engineer";
    expect(foo.say()).to.equal("Hi I am bar a engineer");
  });

  it("uses mixin properties", function() {
    var Occupation = {
      occupation: "your occupation",
      say: function() {
        return "a " + this.occupation;
      }
    };
    var Salute = {
      name: "your name",
      say: function() {
        return "Hi I am " + this.name + " " + this._super();
      }
    };
    var Foo = Class.extend(Salute, Occupation);

    var foo = new Foo();
    expect(foo.say()).to.equal("Hi I am your name a your occupation");
    foo.name = "bar";
    foo.occupation = "engineer";
    expect(foo.say()).to.equal("Hi I am bar a engineer");
  });

  it("store default properties in the prototype", function() {
    var Foo = Class.extend({
      foo: "foo"
    });

    var foo = new Foo();
    expect(foo.foo).to.equal("foo");
    foo.foo = "bar";
    expect(foo.foo).to.equal("bar");
    delete foo.foo;
    expect(foo.foo).to.equal("foo");
  });

  it(".overrideClass override class level properties", function() {
    var Foo = Class.extend();
    Foo.overrideClass({
      displayName: "Foo",
      say: function(msg) {
        return "foo" + msg;
      }
    });

    var Bar = Foo.extend();
    Bar.overrideClass({
      displayName: "Bar",
      say: function(msg) {
        return "bar" + this._super(msg);
      }
    });

    expect(Foo.displayName).to.equal("Foo");
    expect(Bar.displayName).to.equal("Bar");
    expect(Foo.say("hi")).to.equal("foohi");
    expect(Bar.say("hi")).to.equal("barfoohi");
  });

  it(".overrideClass accept mixins", function() {
    var Salute = {
      say: function(msg) {
        return "foo" + msg;
      }
    };
    var Foo = Class.extend();
    Foo.overrideClass(Salute, {
      displayName: "Foo",
    });

    expect(Foo.displayName).to.equal("Foo");
    expect(Foo.say("hi")).to.equal("foohi");
  });

  it("can't call .overrideClass in the base Class", function() {
    expect(function() {
      Class.overrideClass();
    }).to.throws(TypeError, "Can't call overrideClass in the base class");

    expect(function() {
      Class.extend().overrideClass();
    }).to.not.throws(TypeError, "Can't call overrideClass in the base class");
  });

});
