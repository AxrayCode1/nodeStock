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
var mops_salemonth = {
  url: 'https://mops.twse.com.tw/nas/t21/sii/t21sc03_#_$_0.html',
  urlOTC: 'https://mops.twse.com.tw/nas/t21/otc/t21sc03_#_$_0.html',
  path: ["".concat(_path["default"].resolve(), "/data/mopsSaleMonth"), "".concat(_path["default"].resolve(), "/data/mopsSaleMonthNoCompany")]
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

var getMopsStockProp = function getMopsStockProp(data) {
  // console.log(data);
  var selectType = undefined;
  var rtn = {};

  switch (data.type) {
    case 'salemonth':
      selectType = mops_salemonth;
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

  if (!data.isCompany) {
    rtn.url = selectType.urlOTC;
    rtn.path = selectType.path[1];
  }

  rtn.url = rtn.url.replace('#', data.year).replace('$', data.month);
  return rtn;
};

var _default = {
  getStockProp: getStockProp,
  getMopsStockProp: getMopsStockProp
}; // '國內上市': 'http://mops.twse.com.tw/nas/t21/sii/t21sc03_{}_{}_0.html',
//               '國外上市': 'http://mops.twse.com.tw/nas/t21/sii/t21sc03_{}_{}_1.html',
//               '國內上櫃': 'http://mops.twse.com.tw/nas/t21/otc/t21sc03_{}_{}_0.html',
//               '國外上櫃': 'http://mops.twse.com.tw/nas/t21/otc/t21sc03_{}_{}_1.html',
//               '國內興櫃': 'http://mops.twse.com.tw/nas/t21/rotc/t21sc03_{}_{}_0.html',
//               '國外興櫃': 'http://mops.twse.com.tw/nas/t21/rotc/t21sc03_{}_{}_1.html',
//               '國內公發公司': 'http://mops.twse.com.tw/nas/t21/pub/t21sc03_{}_{}_0.html',
//               '國外公發公司': 'http://mops.twse.com.tw/nas/t21/pub/t21sc03_{}_{}_1.html'

exports["default"] = _default;