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

export default {getStockProp};