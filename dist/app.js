"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _stock = _interopRequireDefault(require("./stock.js"));

var _yargs = _interopRequireDefault(require("yargs"));

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
    _stock["default"].catchGoodInfoStock({
      type: argv.t,
      isCompany: argv.company
    });
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
    }
  },
  handler: function handler(argv) {
    // console.log(argv);
    _stock["default"].catchMopsStock({
      type: argv.t,
      isCompany: argv.company,
      year: argv.y
    }); // stock.catchStock({type:argv.t,isCompany:argv.company});

  }
});

_yargs["default"].parse();