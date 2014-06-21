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

function makeClass() {
  function Class() {
    if (typeof this.init === "function") {
      this.init.apply(this, arguments);
    }
  }

  Class.extend = function(/* mixins... */) {
    var Class = makeClass();
    var mixins = Array.prototype.slice.call(arguments);
    var i, mixin, key, length;
    Class.prototype = Object.create(this.prototype);
    Class.overrideClass(this);

    // apply functions
    for(i = mixins.length -1; i >= 0; i--) {
      mixin = mixins[i];
      for(key in mixin) {
        if (typeof Class.prototype[key] === "function") {
          Class.prototype[key] = makeSuper(mixin[key], Class.prototype[key]);
        } else {
          Class.prototype[key] = mixin[key];
        }
      }
    }

    // apply properties
    for(i = 0, length = mixins.length; i < length; i++) {
      mixin = mixins[i];
      for(key in mixin) {
        if (typeof Class.prototype[key] !== "function") {
          Class.prototype[key] = mixin[key];
        }
      }
    }
    return Class;
  };

  Class.overrideClass = function() {
    var mixins = Array.prototype.slice.call(arguments);
    var i, mixin, key, length;

    // apply functions
    for(i = mixins.length -1; i >= 0; i--) {
      mixin = mixins[i];
      for(key in mixin) {
        if (typeof this[key] === "function") {
          this[key] = makeSuper(mixin[key], this[key]);
        } else {
          this[key] = mixin[key];
        }
      }
    }

    // apply properties
    for(i = 0, length = mixins.length; i < length; i++) {
      mixin = mixins[i];
      for(key in mixin) {
        if (typeof this[key] !== "function") {
          this[key] = mixin[key];
        }
      }
    }
    return this;
  };

  return Class;
}

module.exports = makeClass();
