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

  Class.extend = function(properties) {
    var Class = makeClass();
    Class.prototype = Object.create(this.prototype);
    for(var key in properties) {
      if (typeof Class.prototype[key] === "function") {
        Class.prototype[key] = makeSuper(properties[key], Class.prototype[key]);
      } else {
        Class.prototype[key] = properties[key];
      }
    }
    return Class;
  };

  return Class;
}


module.exports = makeClass();
