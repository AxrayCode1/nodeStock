"use strict";

var _require = require('worker_threads'),
    parentPort = _require.parentPort,
    workerData = _require.workerData;

var b = 0;

for (var i = 0; i < 1000; i++) {
  b += i;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

var data = workerData;
setTimeout(function () {
  parentPort.postMessage(data);
}, getRandomInt(5000));