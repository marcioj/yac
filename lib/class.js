"use strict";

var Class = {
  extend: function(properties) {
    function Class() {
      if (typeof this.init === "function") {
        this.init.apply(this, arguments);
      }
    }
    Class.prototype = properties;
    return Class;
  }
};

module.exports = Class;
