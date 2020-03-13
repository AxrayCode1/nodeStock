"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _readOnlyError2 = _interopRequireDefault(require("@babel/runtime/helpers/readOnlyError"));

var _proxy = _interopRequireDefault(require("./tools/proxy.js"));

var _tools = _interopRequireDefault(require("./tools/tools.js"));

var _stockConfig = _interopRequireDefault(require("./config/stockConfig.js"));

var _fs = _interopRequireDefault(require("fs"));

// import date from 'date-and-time';
var _require = require('worker_threads'),
    Worker = _require.Worker,
    workerData = _require.workerData; // import {Iconv} from 'iconv';


var Iconv = require('iconv').Iconv;

var Buffer = require('buffer/').Buffer;

var proxys;
var stocks;
var queueWorks;
var runIndex;
var queueMax = 10;
var reUseProxyMax = 8;
var sleepTime = 5000;
var maxGetCount = 10;
var catchProp = {};
var pathProxy = '/opt/lampp/node/nodeProject/stock/src/proxyRaw.txt';
var pathStockNoCompany = '/opt/lampp/node/nodeProject/stock/src/stockNoCompany.txt';
var pathStock = '/opt/lampp/node/nodeProject/stock/src/stock.txt';

var getAllProxy = function getAllProxy() {
  return _proxy["default"].parseProxy(pathProxy);
};

var removeQueue = function removeQueue(id) {
  var pos = queueWorks.map(function (e) {
    return e.id;
  }).indexOf(id);
  queueWorks.splice(pos, 1);
};

var catchGoodInfoStock = function catchGoodInfoStock(data) {
  catchProp = data;
  queueWorks = [];
  if (catchProp.isCompany) stocks = getStocksNumberArr(pathStock);else stocks = getStocksNumberArr(pathStockNoCompany);
  maxGetCount = stocks.length;
  runIndex = 0;
  insertQueue();
  watchQueue();
};

var insertCatchMonth = function insertCatchMonth() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();

  if (catchProp.year === year) {
    if (day < 12) {
      (0, _readOnlyError2["default"])("month"), --month;
    }
  }

  console.log('Month', month);

  for (var i = 0; i < month; i++) {
    var rightMonth = i + 1;
    queueWorks.push({
      id: rightMonth,
      inWork: false
    });
  }
};

var catchMopsStock = function catchMopsStock(data) {
  catchProp = data;
  queueWorks = [];
  insertCatchMonth();
  catchProp.year = catchProp.year - 1911;
  maxGetCount = queueWorks.length;
  runIndex = 0; // console.log('queue',queueWorks);

  watchQueue(true);
};

var watchQueue = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var isMops,
        filterWorks,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            isMops = _args.length > 0 && _args[0] !== undefined ? _args[0] : false;
            runIndex = 0;

          case 2:
            if (!true) {
              _context.next = 17;
              break;
            }

            filterWorks = queueWorks.filter(function (work) {
              return work.inWork === false;
            });
            filterWorks.forEach(function (filterWork) {
              filterWork.inWork = true;
              createCatchThread(filterWork.id, isMops);
            });
            console.log('Queue Length', queueWorks.length);

            if (!(!isMops && runIndex !== maxGetCount && queueWorks.length < queueMax)) {
              _context.next = 9;
              break;
            }

            // console.log('insert queue');        
            insertQueue();
            return _context.abrupt("continue", 2);

          case 9:
            if (!(runIndex === maxGetCount && queueWorks.length === 0 || isMops && queueWorks.length == 0)) {
              _context.next = 13;
              break;
            }

            console.log('All Done!');
            process.exit();
            return _context.abrupt("break", 17);

          case 13:
            _context.next = 15;
            return _tools["default"].sleep(sleepTime);

          case 15:
            _context.next = 2;
            break;

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function watchQueue() {
    return _ref.apply(this, arguments);
  };
}();

var insertQueue = function insertQueue() {
  var insertCount = queueMax - queueWorks.length;

  for (var i = 0; i < insertCount; i++) {
    if (runIndex !== maxGetCount) {
      queueWorks.push({
        id: stocks[runIndex],
        inWork: false
      });
      console.log('Run Index:', runIndex);
      runIndex++;
    }
  }
};

var createCatchThread = function createCatchThread(id, isMops) {
  var data = creatWorkData(id, isMops);

  if (_fs["default"].existsSync(data.writePath)) {
    console.log('File Exist Escape ', id);
    removeQueue(id);
  } else {
    console.log(data);
    var worker1 = new Worker(__dirname + '/httpRequest.js', {
      workerData: data
    });
    console.log('New Thread:', id);
    waitThreadCallback(worker1, id, isMops);
  }
};

var creatWorkData = function creatWorkData(id, isMops) {
  var stockProp = {};
  var writePathTemp = '';

  if (isMops) {
    catchProp.month = id;
    stockProp = _stockConfig["default"].getMopsStockProp(catchProp);
    writePathTemp = "".concat(stockProp.path, "/").concat(catchProp.year, "_").concat(catchProp.month, ".html");
  } else {
    stockProp = _stockConfig["default"].getStockProp(catchProp.type, catchProp.isCompany);

    _tools["default"].createDir("".concat(stockProp.path, "/").concat(id));

    writePathTemp = "".concat(stockProp.path, "/").concat(id, "/").concat(catchProp.type, "_").concat(id, ".html");
  }

  var proxy = undefined;

  if (!isMops) {
    if (!proxys) {
      proxys = getAllProxy();
    }

    for (var i = 0; i < 10; i++) {
      if (!proxy) {
        proxy = getOneProxy();
      }
    }
  }

  var url = stockProp.url;
  var data = {
    url: url,
    id: id,
    proxy: proxy,
    writePath: writePathTemp,
    isMops: isMops
  };
  return data;
};

var waitThreadCallback = function waitThreadCallback(runningWorker, id, isMops) {
  runningWorker.on('error', function (error) {
    console.log(error); // removeQueue(id);

    createCatchThread(id, isMops);
  });
  runningWorker.on('exit', function (code) {
    if (queueWorks.filter(function (e) {
      return e === id;
    }).length > 0) {
      // removeQueue(id);
      createCatchThread(id, isMops);
    }
  });
  runningWorker.on('message', function (message) {
    if (message.result) {
      console.log('Success', message.id);
      console.log(message.writePath);
      console.log(message.body); // console.log(Buffer.from(message.body));            

      _fs["default"].writeFile(message.writePath, message.body, function () {
        console.log('Write Done ', message.id);
      });

      removeQueue(id);
    } else {
      console.log('Retry', id);
      createCatchThread(id, isMops);
    }
  });
}; // const setProxyProp = (proxy) => {
// }


var getOneProxy = function getOneProxy() {
  var randomIndex;
  var filterProxys;
  var selectProxy;

  if (!proxys) {
    proxys = getAllProxy();
  }

  filterProxys = proxys.filter(function (proxy) {
    return proxy.canUse === true && proxy.reUseCount > 0 && proxy.reUseCount < reUseProxyMax;
  });

  if (filterProxys.length > 0) {
    randomIndex = Math.floor(Math.random() * filterProxys.length);
    selectProxy = filterProxys[randomIndex];
    selectProxy.reUseCount = selectProxy.reUseCount + 1; // console.log('=====filter=====',selectProxy);
  } else {
    randomIndex = Math.floor(Math.random() * proxys.length);
    filterProxys = proxys.filter(function (proxy) {
      return proxy.canUse === true && proxy.reUseCount < 5;
    });
    selectProxy = filterProxys[randomIndex]; // console.log('=====New=====',selectProxy);  
  }

  return selectProxy;
};

var getStocksNumberArr = function getStocksNumberArr(path) {
  var stocks = [];

  var bufferData = _fs["default"].readFileSync(path);

  var lines = bufferData.toString().trim().split('\n');
  lines.forEach(function (line) {
    stocks.push(line.trim());
  });
  return stocks;
};

var _default = {
  catchGoodInfoStock: catchGoodInfoStock,
  catchMopsStock: catchMopsStock
}; // const timeoutID = new setInterval(()=>{
//     runQueue();
//     const queueLength = queueWorks.length;
//     // console.log('====Work:',queueLength,'====')
//     // if(queueLength < queueMax){
//     //     if(runIndex !== maxGetCount){
//     //         let insertLength = queueMax - queueLength;            
//     //         for(let i=0; i < insertLength; i++){                
//     //             queueWorks.push({id: stocks[runIndex],inWork: false});
//     //             runIndex++;
//     //             if(runIndex === maxGetCount)
//     //                 break;
//     //         }
//     //     }
//     // }
//     if(queueLength === 0){
//         if(runIndex !== maxGetCount){
//             let insertLength = queueMax - queueLength;            
//             for(let i=0; i < insertLength; i++){                
//                 queueWorks.push({id: stocks[runIndex],inWork: false});
//                 runIndex++;
//                 if(runIndex === maxGetCount)
//                     break;
//             }
//         }
//     }
//     console.log('Now Run Index : ',runIndex,' Queue Length : ',queueLength);
//     if(runIndex === maxGetCount && queueLength === 0){
//         console.log('Clear Interval');
//         clearInterval(timeoutID);
//     }                
// },10000)
// while(true){
//     runQueue();
//     const queueLength = queueWorks.length;
//     // console.log('====Work:',queueLength,'====')
//     if(queueLength < queueMax){
//         if(runIndex !== maxGetCount){
//             let insertLength = queueMax - queueLength;            
//             for(let i=0; i < insertLength; i++){                
//                 queueWorks.push({id: stocks[runIndex],inWork: false});
//                 runIndex++;
//                 if(runIndex === maxGetCount)
//                     break;
//             }
//         }
//     }
//     console.log('Now Run Index : ',runIndex,' Queue Length : ',queueLength);
//     if(runIndex === maxGetCount && queueLength === 1){
//         break;
//     }                
//     await tools.sleep(10000);        
// }
// const httpRequestCallBack = (responseData) =>{
//     const {data, error, response} = responseData;
//     if(error){
//         data.proxy.canUse = false;
//         console.log('=======Error=======',data.id);
//         sendHttpRequest(data);
//     }else{
//         if(response.statusCode == 200){
//             console.log(data);
//             if(data.proxy && data.proxy.reUseCount == 0){
//                 data.proxy.reUseCount = 1;
//             }
//             const pos = queueWorks.map(function(e) { return e.id; }).indexOf(data.id);
//             queueWorks.splice(pos,1);
//             console.log('====== Response : ', data.url, response.statusCode, '======');
//             fs.writeFileSync(`data/${data.id}`,response.body);
//         }
//         else{
//             console.log('=======Wrong Status Code=======',data.id);
//             sendHttpRequest(data);
//         }
//         // htmlParser.parseGetIPHtml(response.body);
//     }
// };
// const sendHttpRequest = (data,callback) => {
//     if(!proxys){        
//         proxys = getAllProxy();
//     }
//     let proxy;    
//     for(let i=0; i < 10; i++){
//         if(!proxy){
//             proxy = getOneProxy();    
//         }
//     }        
//     console.log('======== Send : ',data.url,' =========');
//     console.log(proxy);
//     console.log('======================================')
//     data.proxy = proxy;    
//     // httpRequest.sendHttpRequestSync(data, httpRequestCallBack);
//     let now = new Date();
//     console.log(date.format(now, 'YYYY/MM/DD HH:mm:ss'));    
//     if (typeof httpRequestCallBack === 'function') {
//         // do something        
//         httpRequest.sendHttpRequestSync(data, httpRequestCallBack);
//     }   
//     else{
//         console.log('Error not function');
//     }
// }
// const lock = () => {
//     lock.acquire("key1", function(done) {
//         console.log("lock1 enter")
//         setTimeout(function() {
//             console.log("lock1 Done")
//             done();
//         }, 3000)
//     }, function(err, ret) {
//         console.log("lock1 release")
//     });
// }

exports["default"] = _default;