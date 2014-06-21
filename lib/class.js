"use strict";

function makeSuper(original, superFunc) {
  function wrap() {
    this._super = superFunc;
    var result = original.apply(this, arguments);
    delete this._super;
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
      if (typeof obj[key] !== "function") {
        obj[key] = mixin[key];
      }
    }
  }
}

function makeClass() {
  function Class() {
    if (typeof this.init === "function") {
      this.init.apply(this, arguments);
    }
  }

  Class.extend = function(/* mixins... */) {
    var Class = makeClass();
    var mixins = Array.prototype.slice.call(arguments);

    Class.prototype = Object.create(this.prototype);
    Class.overrideClass(this);
    applyMixins(Class.prototype, mixins);

    return Class;
  };

  Class.overrideClass = function(/* mixins... */) {
    var mixins = Array.prototype.slice.call(arguments);

    applyMixins(this, mixins);

    return this;
  };

  return Class;
}

module.exports = makeClass();
