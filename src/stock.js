import proxy from './tools/proxy.js';
import tools from './tools/tools.js';
import stockConfig from './config/stockConfig.js';
import fs from 'fs';
// import date from 'date-and-time';
const { Worker,workerData } = require('worker_threads');

let proxys;
let stocks;
let queueWorks;
let runIndex;

const queueMax = 10;
const reUseProxyMax = 8;
const sleepTime = 5000;
let maxGetCount = 10;

let catchProp = {};

const pathProxy = '/opt/lampp/node/nodeProject/stock/src/proxyRaw.txt';
const pathStockNoCompany = '/opt/lampp/node/nodeProject/stock/src/stockNoCompany.txt';
const pathStock = '/opt/lampp/node/nodeProject/stock/src/stock.txt';

const getAllProxy = () => {
    return proxy.parseProxy(pathProxy);
}

const catchStock = (data) => {     
    catchProp = data;       
    queueWorks = [];
    if(catchProp.isCompany)
        stocks = getStocksNumberArr(pathStock);
    else
        stocks = getStocksNumberArr(pathStockNoCompany);        
    maxGetCount = stocks.length;
    runIndex = 0;
    watchQueue();    
}

const insertQueue = ()=>{           
    const insertCount = queueMax - queueWorks.length;
    for(let i= 0; i < insertCount; i++){
        if(runIndex !== maxGetCount){
            queueWorks.push({id: stocks[runIndex],inWork: false});       
            console.log('Run Index:',runIndex);       
            runIndex++;
        }
    }
}

const watchQueue = async() =>{
    runIndex = 0;
    insertQueue();
    while(true){
        const filterWorks = queueWorks.filter((work)=>work.inWork === false);
        filterWorks.forEach(filterWork=>{
            filterWork.inWork = true;                        
            createCatchThread(filterWork.id);
        });
        console.log('Queue Length',queueWorks.length);
        if(runIndex !== maxGetCount && queueWorks.length < queueMax){
            // console.log('insert queue');        
            insertQueue();
            continue;
        }
        if(runIndex === maxGetCount && queueWorks.length === 0){
            console.log('All Done!');  
            process.exit();          
            break;
        }            
        await tools.sleep(sleepTime);        
    }
}

const createCatchThread = (id) => {
    // console.log(catchProp);
    // url: 'https://get-site-ip.com/',  
    const stockProp = stockConfig.getStockProp(catchProp.type,catchProp.isCompany);

    const url = stockProp.url;
    if(!proxys){        
        proxys = getAllProxy();
    }
    let proxy;    
    for(let i=0; i < 10; i++){
        if(!proxy){
            proxy = getOneProxy();    
        }
    }   
    tools.createDir(`${stockProp.path}/${id}`);            
    const data = {
        url: url, 
        id: id,
        proxy:proxy,
        writePath:`${stockProp.path}/${id}/${catchProp.type}_${id}.html`
    };
    if(fs.existsSync(data.writePath)){
        console.log('File Exist Escape ',id);
        removeQueue(id);
    }else{
        const worker1 = new Worker(__dirname +'/httpRequest.js',{
            workerData: data
        });    
        console.log('New Thread:',id);
        waitThreadCallback(worker1,id);
    }    
}

const waitThreadCallback = (runningWorker,id) => {    
    runningWorker.on('error', (error) => {
        console.log(error);
        // removeQueue(id);
        createCatchThread(id);
    });

    runningWorker.on('exit', (code) => {                      
        if(queueWorks.filter((e)=>e===id).length > 0){
            // removeQueue(id);
            createCatchThread(id);
        }
    });

    runningWorker.on('message', (message) => {        
        if(message.result){
            console.log('Success', message.id);     
            console.log(message.writePath);
            fs.writeFile(message.writePath,message.body,()=>{
                console.log('Write Done ',message.id);
            });       
            removeQueue(id);    
        }else{
            console.log('Retry', id);            
            createCatchThread(id);
        }               
    });
}

const removeQueue = (id) => {
    const pos = queueWorks.map(function(e) { return e.id; }).indexOf(id);
    queueWorks.splice(pos,1);    
}

const setProxyProp = (proxy) => {

}

const getOneProxy = () =>{
    let randomIndex;
    let filterProxys;
    let selectProxy;        
    if(!proxys){        
        proxys = getAllProxy();
    }
    filterProxys = proxys.filter(proxy => proxy.canUse === true && proxy.reUseCount > 0 && proxy.reUseCount < reUseProxyMax);
    if(filterProxys.length > 0){        
        randomIndex = Math.floor(Math.random() * filterProxys.length);
        selectProxy = filterProxys[randomIndex];
        selectProxy.reUseCount = selectProxy.reUseCount + 1;
        // console.log('=====filter=====',selectProxy);
    }else{
        randomIndex = Math.floor(Math.random() * proxys.length);
        filterProxys = proxys.filter(proxy => proxy.canUse === true && proxy.reUseCount < 5);    
        selectProxy = filterProxys[randomIndex];    
        // console.log('=====New=====',selectProxy);  
    }    
    return selectProxy;
}


const getStocksNumberArr = (path) => {
    const stocks = [];
    const bufferData = fs.readFileSync(path);
    const lines = bufferData.toString().trim().split('\n')
    lines.forEach(line => {
        stocks.push(line.trim());
    });
    return stocks;
}

export default {catchStock};


// const timeoutID = new setInterval(()=>{
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