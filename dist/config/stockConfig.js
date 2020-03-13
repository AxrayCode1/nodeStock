"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var salemonth = {
  url: 'https://goodinfo.tw/StockInfo/ShowSaleMonChart.asp?STOCK_ID=',
  path: ["".concat(_path["default"].resolve(), "/data/stockSaleMonth"), "".concat(_path["default"].resolve(), "/data/stockSaleMonthNoCompany")]
};
var performance = {
  url: 'https://goodinfo.tw/StockInfo/StockBzPerformance.asp?STOCK_ID=%s&RPT_CAT=M_QUAR"',
  path: ["".concat(_path["default"].resolve(), "/data/stockPerformance"), "".concat(_path["default"].resolve(), "/data/stockPerformanceNoCompany")]
};
var dividend = {
  url: 'https://goodinfo.tw/StockInfo/StockBzPerformance.asp?STOCK_ID=%s&RPT_CAT=M_QUAR"',
  path: ["".concat(_path["default"].resolve(), "/data/stockDividend"), "".concat(_path["default"].resolve, "/data/stockDividendNoCompany")]
};

var getStockProp = function getStockProp(type, isCompany) {
  var selectType = undefined;
  var rtn = {};

  switch (type) {
    case 'salemonth':
      selectType = salemonth;
      break;

    case 'performance':
      selectType = performance;
      break;

    case 'dividend':
      selectType = dividend;
      break;
  }

  rtn.url = selectType.url;
  rtn.path = selectType.path[0];
  if (!isCompany) rtn.path = selectType.path[1];
  return rtn;
};

var _default = {
  getStockProp: getStockProp
};
exports["default"] = _default;