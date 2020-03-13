"use strict";

var _require = require('worker_threads'),
    Worker = _require.Worker,
    workerData = _require.workerData;

var path = require('path');

for (var i = 0; i < 50; i++) {
  var worker1 = new Worker(path.resolve('./worker.js'), {
    workerData: {
      data: "hello"
    }
  });
  worker1.on('message', function (message) {
    console.log('main thread get message', message);
  });
}