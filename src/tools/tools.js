import fs from 'fs';

const sleep = async (ms = 0) => {
    return new Promise(r => setTimeout(r, ms));
}

const createDir = (path) => {
    if(!fs.existsSync(path))
        fs.mkdirSync(path);
}

export default{sleep, createDir};
