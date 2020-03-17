"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _stock = _interopRequireDefault(require("./stock.js"));

var _yargs = _interopRequireDefault(require("yargs"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

_yargs["default"].version('1.1.0');

_yargs["default"].command({
  command: 'catch_goodinfo',
  describe: 'Catch GoodInfo Stock Html',
  builder: {
    type: {
      alias: 't',
      choices: ['salemonth', 'performance', 'dividend'],
      describe: 'Catch Type',
      demandOption: true,
      type: 'string'
    },
    company: {
      alias: 'c',
      choices: [0, 1],
      describe: 'Is Company',
      demandOption: true,
      type: 'number'
    } // url: {
    //     alias: 'u',
    //     demandOption:true,
    //     default: 'http://yargs.js.org/'
    // }

  },
  handler: function handler(argv) {
    // console.log(argv);
    _stock["default"].catchGoodInfoStock(_objectSpread({
      isMops: false
    }, argv));
  }
});

_yargs["default"].command({
  command: 'catch_mops',
  describe: 'Catch Mops Stock Html',
  builder: {
    type: {
      alias: 't',
      choices: ['salemonth', 'performance', 'dividend'],
      describe: 'Catch Type',
      demandOption: true,
      type: 'string'
    },
    company: {
      alias: 'c',
      choices: [0, 1],
      describe: 'Is Company',
      demandOption: true,
      type: 'number'
    },
    year: {
      alias: 'y',
      describe: 'Year(Like 2020,2019 ...)',
      demandOption: true,
      type: 'number'
    },
    season: {
      alias: 's',
      describe: 'Session',
      choices: ['01', '02', '03', '04'],
      type: 'string'
    }
  },
  handler: function handler(argv) {
    // console.log(argv);        
    _stock["default"].catchMopsStock(_objectSpread({
      isMops: true
    }, argv)); // stock.catchStock({type:argv.t,isCompany:argv.company});

  }
});

_yargs["default"].parse();