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

const mops_performance={
    // url: 'https://mops.twse.com.tw/server-java/t164sb01?step=1&CO_ID=#&SYEAR=$&SSEASON=%&REPORT_ID=C',
    url: 'https://mops.twse.com.tw/mops/web/ajax_t164sb04',
    path: [`${path.resolve()}/data/mopsPerformance`,`${path.resolve()}/data/mopsPerformanceNoCompany`]
}

const getStockProp = (data)=>{
    let selectType=undefined;
    const rtn = {};
    switch(data.type){
        case 'salemonth':
            selectType = salemonth;
            rtn.url = selectType.url + data.id;
            break;
        case 'performance':
            selectType = performance;
            break;
        case 'dividend':
            selectType = dividend;
            break;
    }    
    rtn.path = selectType.path[0];
    if(!data.company)
        rtn.path = selectType.path[1];
    return rtn;
}

const createFormData = (data) => {
    const formData = {};
    switch(data.type){
        case 'performance':
            formData.encodeURIComponent=1;
            formData.step=1;
            formData.firstin=1;
            formData.off=1
            formData.co_id=data.id;
            formData.year=data.year;
            formData.season=data.season;
            break;
    }
    return formData;
}

const getMopsStockProp = (data)=>{
    // console.log(data);
    let selectType=undefined;
    const rtn = {};
    switch(data.type){
        case 'salemonth':            
            selectType = mops_salemonth;
            rtn.url = selectType.url;
            if(!data.company)
                rtn.url = selectType.urlOTC;
            rtn.url = rtn.url.replace('#',data.year).replace('$',data.month);      
            break;
        case 'performance':
            selectType = mops_performance;
            rtn.form = createFormData(data);
            // rtn.url = selectType.url.replace('#',data.id).replace('$',data.year).replace('%',data.session);
            rtn.url = selectType.url;
            break;
        case 'dividend':
            selectType = dividend;
            break;
    }    
    rtn.path = selectType.path[0];
    if(!data.company){        
        rtn.path = selectType.path[1];
    }              
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

// performance
// https://mops.twse.com.tw/server-java/t164sb01?step=1&CO_ID=1101&SYEAR=2019&SSEASON=3&REPORT_ID=C