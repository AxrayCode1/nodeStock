import fs from 'fs';

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const parseProxy = (path) => {
    const proxys = parseRawFileToArr(path);
    return proxys;
}

const parseRawFileToArr = (path) => {
    const proxys = [];
    const bufferData = fs.readFileSync(path);
    const lineStrs = bufferData.toString().trim().split('\n');
    lineStrs.forEach(str => {                
        const inlineStrs = str.trim().split('\t');
        const url = `http://${inlineStrs[0]}:${inlineStrs[1]}`;        
        proxys.push({url:url,canUse:true,reUseCount:0,host:inlineStrs[0],port:inlineStrs[1]});
    });
    return proxys;
}

export default {parseProxy};