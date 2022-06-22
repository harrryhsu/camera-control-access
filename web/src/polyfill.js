import { polyfill } from "es6-promise";
import "whatwg-fetch";

polyfill();

if (typeof Object.assign != "function") {
  Object.assign = function (target) {
    "use strict";
    if (target == null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

if (typeof Array.prototype.assign != "function") {
  Array.prototype.findIndex = function (callback, thisArg) {
    if (!callback || typeof callback !== "function") throw TypeError();
    const size = this.length;
    const that = thisArg || this;
    for (var i = 0; i < size; i++) {
      try {
        if (callback.apply(that, [this[i], i, this])) {
          return i;
        }
      } catch (e) {
        return -1;
      }
    }
    return -1;
  };
}

if (typeof Object.keys != "function") {
  Object.keys = function (obj) {
    var keys = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }

    return keys;
  };
}
