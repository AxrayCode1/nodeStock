import path from 'path';

const salemonth={
    url: 'https://goodinfo.tw/StockInfo/ShowSaleMonChart.asp?STOCK_ID=',    
    path:[`${path.resolve()}/data/stockSaleMonth`,`${path.resolve()}/data/stockSaleMonthNoCompany`]    
}

const performance={
    url: 'https://goodinfo.tw/StockInfo/StockBzPerformance.asp?STOCK_ID=%s&RPT_CAT=M_QUAR"',
    path:[`${path.resolve()}/data/stockPerformance`,`${path.resolve()}/data/stockPerformanceNoCompany`]
}

const dividend={
    url: 'https://goodinfo.tw/StockInfo/StockBzPerformance.asp?STOCK_ID=%s&RPT_CAT=M_QUAR"',
    path:[`${path.resolve()}/data/stockDividend`,`${path.resolve}/data/stockDividendNoCompany`]
}

const mops_salemonth={
    url: 'https://mops.twse.com.tw/nas/t21/sii/t21sc03_#_$_0.html',
    urlOTC: 'https://mops.twse.com.tw/nas/t21/otc/t21sc03_#_$_0.html',
    path:[`${path.resolve()}/data/mopsSaleMonth`,`${path.resolve()}/data/mopsSaleMonthNoCompany`]    
}

const getStockProp = (type, isCompany)=>{
    let selectType=undefined;
    const rtn = {};
    switch(type){
        case 'salemonth':
            selectType = salemonth;
            break;
        case 'performance':
            selectType = performance;
            break;
        case 'dividend':
            selectType = dividend;
            break;
    }
    rtn.url = selectType.url;
    rtn.path = selectType.path[0];
    if(!isCompany)
        rtn.path = selectType.path[1];
    return rtn;
}

const getMopsStockProp = (data)=>{
    // console.log(data);
    let selectType=undefined;
    const rtn = {};
    switch(data.type){
        case 'salemonth':
            selectType = mops_salemonth;
            break;
        case 'performance':
            selectType = performance;
            break;
        case 'dividend':
            selectType = dividend;
            break;
    }
    rtn.url = selectType.url
    rtn.path = selectType.path[0];
    if(!data.isCompany){
        rtn.url = selectType.urlOTC;
        rtn.path = selectType.path[1];
    }
    rtn.url = rtn.url.replace('#',data.year).replace('$',data.month);                
    return rtn;
}

export default {getStockProp,getMopsStockProp};

// '國內上市': 'http://mops.twse.com.tw/nas/t21/sii/t21sc03_{}_{}_0.html',
//               '國外上市': 'http://mops.twse.com.tw/nas/t21/sii/t21sc03_{}_{}_1.html',
//               '國內上櫃': 'http://mops.twse.com.tw/nas/t21/otc/t21sc03_{}_{}_0.html',
//               '國外上櫃': 'http://mops.twse.com.tw/nas/t21/otc/t21sc03_{}_{}_1.html',
//               '國內興櫃': 'http://mops.twse.com.tw/nas/t21/rotc/t21sc03_{}_{}_0.html',
//               '國外興櫃': 'http://mops.twse.com.tw/nas/t21/rotc/t21sc03_{}_{}_1.html',
//               '國內公發公司': 'http://mops.twse.com.tw/nas/t21/pub/t21sc03_{}_{}_0.html',
//               '國外公發公司': 'http://mops.twse.com.tw/nas/t21/pub/t21sc03_{}_{}_1.html'