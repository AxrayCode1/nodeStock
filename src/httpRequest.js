// import request from 'request';
// import url from 'url';
import HttpsProxyAgent from 'https-proxy-agent';
import rp from 'request-promise';
const { parentPort, workerData } = require('worker_threads');
import https from 'https';
import fs from 'fs';

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const httpuseragents=[
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
    "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1",
    "Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 6.0.1; SGP771 Build/32.2.A.0.253; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 6.0.1; SHIELD Tablet K1 Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Safari/537.36"
]

// const sendHttpRequestSync = (data,callback) => {    
//     const httpUseraAgent = httpuseragents[Math.floor(Math.random() * httpuseragents.length)];
//     const opts = {
//         uri: data.url,
//         timeout: 5000,
//         followRedirect: true,
//         maxRedirects: 10,
//         headers: {
//             'User-Agent':httpUseraAgent
//         }
//     }   
//     if(data.proxy){
//         const proxyOpts = url.parse(data.proxy.url);
//         const agent = new HttpsProxyAgent(proxyOpts);
//         opts.agent = agent;
//     }

//     request(opts, (error, response) => {
//         const responseData = {
//             data : data,
//             error : error,
//             response : response
//         }
//         callback(responseData);              
//     })    
// }

const sendHttpRequest = (data) => { 
    // return new Promise((resolve) => {   
    const httpUseraAgent = httpuseragents[Math.floor(Math.random() * httpuseragents.length)];
    const opts = {
        uri: data.url,
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10,
        resolveWithFullResponse: true,
        headers: {
            'User-Agent':httpUseraAgent
        }
    }       
    if(data.proxy){        
        const agent = new HttpsProxyAgent(data.proxy.url);
        opts.agent = agent;        
    }    
    try {
        let done = false;        
        const send = rp(opts).then((repos) => {            
            done =true;
            console.log(repos.statusCode);
            // console.log(repos.body);
            data.result = false;
            if(repos.statusCode == 200){
                data.body = repos.body;
                data.result = true;            
            }
            parentPort.postMessage(data);
        })
        .catch((err) => {                         
            if(!done){
                done =true;
                data.result = false;                            
                parentPort.postMessage(data);              
            }
        })         
        setTimeout(()=>{            
            if(!done){ 
                done = true;
                data.result = false;      
                parentPort.postMessage(data);  
                console.log('cancel:',data.id);
                send.cancel();                      
            }           
        },60000)
    }catch(error){       
        if(!done){ 
            done = true; 
            data.result = false;             
            parentPort.postMessage(data);
        }
    }
}

const data = workerData;
const cloneData = Object.assign({}, data);
// console.log(data);
// parentPort.postMessage(data);
sendHttpRequest(cloneData);

// export default {sendHttpRequestSync,sendHttpRequest};


// const proxy = 'http://115.87.111.231:8213';
// // const opts = {
// //     host:'115.87.111.231',
// //     port:8213,
// //     protocol: 'https:'
// // }
// const opts = url.parse('http://115.87.111.231:8213');
// // opts.rejectUnauthorized = false;
// // opts.keepAlive = true;                // workaround part i.
// // opts.secureProtocol = 'TLSv1_method'; // workaround part ii.
// // opts.ciphers = 'ALL';                  // workaround part ii.
// // console.log(opts);
// const agent = new HttpsProxyAgent(opts);
// const options = url.parse("https://get-site-ip.com/");
// options.agent = agent;
// // https.get(options, function (res) {
// //     console.log('"response" event!', res.headers);
// //     res.pipe(process.stdout);
// //   });
// request({uri:"https://get-site-ip.com/", agent:agent, timeout:10000}, (error, response, body) => {
//     console.error('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body); // Print the HTML for the Google homepage.
// })