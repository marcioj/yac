"use strict";

var BaseClass = makeClass();

function makeSuper(original, superFunc) {
  function wrap() {
    var length = arguments.length;
    var args = new Array(length);
    for (var i = 0; i < length; i ++) {
      args[i] = arguments[i];
    }

    this._super = superFunc;
    var result = original.apply(this, args);
    this._super = undefined;
    return result;
  }
  return wrap;
}

function applyMixins(obj, mixins) {
  var i, mixin, key, length;
  // apply functions
  for(i = mixins.length -1; i >= 0; i--) {
    mixin = mixins[i];
    for(key in mixin) {
      if(!mixin.hasOwnProperty(key)) { continue; }
      if (typeof obj[key] === "function") {
        obj[key] = makeSuper(mixin[key], obj[key]);
      } else {
        obj[key] = mixin[key];
      }
    }
  }

  // apply properties
  for(i = 0, length = mixins.length; i < length; i++) {
    mixin = mixins[i];
    for(key in mixin) {
      if(!mixin.hasOwnProperty(key)) { continue; }
      if (typeof obj[key] !== "function") {
        obj[key] = mixin[key];
      }
    }
  }
}

function makeClass() {
  function Class() {
    this._super = undefined;
    if (typeof this.init === "function") {
      this.init.apply(this, arguments);
    }
  }

  Class.extend = function(/* mixins... */) {
    var Class = makeClass();
    var length = arguments.length;
    var mixins = new Array(length);

    for (var i = 0; i < length; i ++) {
      mixins.push(arguments[i]);
    }

    Class.prototype = Object.create(this.prototype);
    Class.overrideClass(this);
    applyMixins(Class.prototype, mixins);

    return Class;
  };

  Class.overrideClass = function(/* mixins... */) {
    if(this === BaseClass) { throw new TypeError("Can't call overrideClass in the base class"); }
    var length = arguments.length;
    var mixins = new Array(length);

    for (var i = 0; i < length; i ++) {
      mixins.push(arguments[i]);
    }

    applyMixins(this, mixins);

    return this;
  };

  return Class;
}

module.exports = BaseClass;
