const { Worker,workerData } = require('worker_threads');
const path = require('path');

for(let i = 0; i< 50; i++){
    const worker1 = new Worker(path.resolve('./worker.js'),{
        workerData: {
            data:"hello"
        }
      });

    worker1.on('message', (message) => {
    console.log('main thread get message', message);
    });
}