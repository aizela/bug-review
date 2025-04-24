"use strict";
require("../../../../common/vendor.js");
const uni_modules_wotDesignUni_components_common_AbortablePromise = require("./AbortablePromise.js");
function addUnit(num) {
  return Number.isNaN(Number(num)) ? `${num}` : `${num}px`;
}
function isObj(value) {
  return Object.prototype.toString.call(value) === "[object Object]" || typeof value === "object";
}
function getType(target) {
  const typeStr = Object.prototype.toString.call(target);
  const match = typeStr.match(/\[object (\w+)\]/);
  const type = match && match.length ? match[1].toLowerCase() : "";
  return type;
}
const isDef = (value) => value !== void 0 && value !== null;
function rgbToHex(r, g, b) {
  const hex = (r << 16 | g << 8 | b).toString(16);
  const paddedHex = "#" + "0".repeat(Math.max(0, 6 - hex.length)) + hex;
  return paddedHex;
}
function hexToRgb(hex) {
  const rgb = [];
  for (let i = 1; i < 7; i += 2) {
    rgb.push(parseInt("0x" + hex.slice(i, i + 2), 16));
  }
  return rgb;
}
const gradient = (startColor, endColor, step = 2) => {
  const sColor = hexToRgb(startColor);
  const eColor = hexToRgb(endColor);
  const rStep = (eColor[0] - sColor[0]) / step;
  const gStep = (eColor[1] - sColor[1]) / step;
  const bStep = (eColor[2] - sColor[2]) / step;
  const gradientColorArr = [];
  for (let i = 0; i < step; i++) {
    gradientColorArr.push(
      rgbToHex(parseInt(String(rStep * i + sColor[0])), parseInt(String(gStep * i + sColor[1])), parseInt(String(bStep * i + sColor[2])))
    );
  }
  return gradientColorArr;
};
const range = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};
const isEqual = (value1, value2) => {
  if (value1 === value2) {
    return true;
  }
  if (!Array.isArray(value1) || !Array.isArray(value2)) {
    return false;
  }
  if (value1.length !== value2.length) {
    return false;
  }
  for (let i = 0; i < value1.length; ++i) {
    if (value1[i] !== value2[i]) {
      return false;
    }
  }
  return true;
};
const padZero = (number, length = 2) => {
  let numStr = number.toString();
  while (numStr.length < length) {
    numStr = "0" + numStr;
  }
  return numStr;
};
const context = {
  id: 1e3
};
function kebabCase(word) {
  const newWord = word.replace(/[A-Z]/g, function(match) {
    return "-" + match;
  }).toLowerCase();
  return newWord;
}
function camelCase(word) {
  return word.replace(/-(\w)/g, (_, c) => c.toUpperCase());
}
function isArray(value) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(value);
  }
  return Object.prototype.toString.call(value) === "[object Array]";
}
function isFunction(value) {
  return getType(value) === "function" || getType(value) === "asyncfunction";
}
function isString(value) {
  return getType(value) === "string";
}
function isPromise(value) {
  if (isObj(value) && isDef(value)) {
    return isFunction(value.then) && isFunction(value.catch);
  }
  return false;
}
function objToStyle(styles) {
  if (isArray(styles)) {
    return styles.filter(function(item) {
      return item != null && item !== "";
    }).map(function(item) {
      return objToStyle(item);
    }).join(";");
  }
  if (isString(styles)) {
    return styles;
  }
  if (isObj(styles)) {
    return Object.keys(styles).filter(function(key) {
      return styles[key] != null && styles[key] !== "";
    }).map(function(key) {
      return [kebabCase(key), styles[key]].join(":");
    }).join(";");
  }
  return "";
}
const pause = (ms = 1e3 / 30) => {
  return new uni_modules_wotDesignUni_components_common_AbortablePromise.AbortablePromise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve(true);
    }, ms);
  });
};
function deepClone(obj, cache = /* @__PURE__ */ new Map()) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (isDate(obj)) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  if (obj instanceof Error) {
    const errorCopy = new Error(obj.message);
    errorCopy.stack = obj.stack;
    return errorCopy;
  }
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  const copy = Array.isArray(obj) ? [] : {};
  cache.set(obj, copy);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone(obj[key], cache);
    }
  }
  return copy;
}
function deepAssign(target, source) {
  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const newObjValue = source[key];
    if (isObj(targetValue) && isObj(newObjValue)) {
      deepAssign(targetValue, newObjValue);
    } else {
      target[key] = newObjValue;
    }
  });
  return target;
}
function debounce(func, wait, options = {}) {
  let timeoutId = null;
  let lastArgs;
  let lastThis;
  let result;
  const leading = isDef(options.leading) ? options.leading : false;
  const trailing = isDef(options.trailing) ? options.trailing : true;
  function invokeFunc() {
    if (lastArgs !== void 0) {
      result = func.apply(lastThis, lastArgs);
      lastArgs = void 0;
    }
  }
  function startTimer() {
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (trailing) {
        invokeFunc();
      }
    }, wait);
  }
  function cancelTimer() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }
  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    if (timeoutId === null) {
      if (leading) {
        invokeFunc();
      }
      startTimer();
    } else if (trailing) {
      cancelTimer();
      startTimer();
    }
    return result;
  }
  return debounced;
}
const getPropByPath = (obj, path) => {
  const keys = path.split(".");
  try {
    return keys.reduce((acc, key) => acc !== void 0 && acc !== null ? acc[key] : void 0, obj);
  } catch (error) {
    return void 0;
  }
};
const isDate = (val) => Object.prototype.toString.call(val) === "[object Date]" && !Number.isNaN(val.getTime());
function isImageUrl(url) {
  const imageRegex = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|image)/i;
  return imageRegex.test(url);
}
exports.addUnit = addUnit;
exports.camelCase = camelCase;
exports.context = context;
exports.debounce = debounce;
exports.deepAssign = deepAssign;
exports.deepClone = deepClone;
exports.getPropByPath = getPropByPath;
exports.getType = getType;
exports.gradient = gradient;
exports.isArray = isArray;
exports.isDate = isDate;
exports.isDef = isDef;
exports.isEqual = isEqual;
exports.isFunction = isFunction;
exports.isImageUrl = isImageUrl;
exports.isObj = isObj;
exports.isPromise = isPromise;
exports.objToStyle = objToStyle;
exports.padZero = padZero;
exports.pause = pause;
exports.range = range;
