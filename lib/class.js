"use strict";

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
      Class.prototype[key] = properties[key];
    }
    return Class;
  };

  return Class;
}


module.exports = makeClass();
