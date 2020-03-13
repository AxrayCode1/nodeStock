"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var sleep = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var ms,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ms = _args.length > 0 && _args[0] !== undefined ? _args[0] : 0;
            return _context.abrupt("return", new Promise(function (r) {
              return setTimeout(r, ms);
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sleep() {
    return _ref.apply(this, arguments);
  };
}();

var createDir = function createDir(path) {
  if (!_fs["default"].existsSync(path)) _fs["default"].mkdirSync(path);
};

var _default = {
  sleep: sleep,
  createDir: createDir
};
exports["default"] = _default;