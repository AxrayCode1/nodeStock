const { parentPort, workerData } = require('worker_threads');

let b = 0;
for (let i = 0; i < 1000; i++) {
  b += i;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
const data = workerData;
setTimeout(()=>{
    parentPort.postMessage(data);
},getRandomInt(5000)); 