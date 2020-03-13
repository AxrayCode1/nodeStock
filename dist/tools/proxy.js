"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var parseProxy = function parseProxy(path) {
  var proxys = parseRawFileToArr(path);
  return proxys;
};

var parseRawFileToArr = function parseRawFileToArr(path) {
  var proxys = [];

  var bufferData = _fs["default"].readFileSync(path);

  var lineStrs = bufferData.toString().trim().split('\n');
  lineStrs.forEach(function (str) {
    var inlineStrs = str.trim().split('\t');
    var url = "http://".concat(inlineStrs[0], ":").concat(inlineStrs[1]);
    proxys.push({
      url: url,
      canUse: true,
      reUseCount: 0,
      host: inlineStrs[0],
      port: inlineStrs[1]
    });
  });
  return proxys;
};

var _default = {
  parseProxy: parseProxy
};
exports["default"] = _default;