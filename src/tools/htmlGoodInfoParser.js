// solid_1_padding_4_0_tbl
const htmlparser2 =require("htmlparser2");
const fs = require('fs');

const catchSession = ['2019','2018'];

const perFormanceFields = ['session','all','fraction','value','avgValue','upAndDow','upAndDownPerc','opIncome','opMargin','opProfit','layIncome','opIncomPerc','opMarginPerc','opProfitPerc','layIncomePerc','sessionROE','yearROE','sessionROA','yearROA','EPS','epsInc','BPS'];

const initFieldtoArr = (fields) => {    
    return fields.map((item,i) => {
        return null
    })
}

const parseGoodInfoPerformanceHtml = (rawHtml) =>{    
    // console.log(rawHtml);        
    const dom = new htmlparser2.parseDOM(rawHtml);
    const finddoms =  htmlparser2.DomUtils.getElementsByTagName('table',dom);
    let tdIndex, a = 0;
    let breakFlag = false;
    const sessionPerformances = [];
    finddoms.forEach(finddom => {
        const className = htmlparser2.DomUtils.getAttributeValue(finddom,'class');              
        // console.log('ClassName：',className);          
        if(className == 'solid_1_padding_4_0_tbl'){
            // console.log("Find Dom:",className);                         
            htmlparser2.DomUtils.getElementsByTagName('tr',finddom).forEach(trdom => {
                tdIndex = 0;
                breakFlag = false;
                const id = trdom.attribs.id;
                let tempFields = null;
                // console.log('id',trdom.attribs);
                if(typeof(id) != "undefined" && id.includes('row')){                    
                    htmlparser2.DomUtils.getElementsByTagName('td',trdom).forEach(tddom => {                                                
                        htmlparser2.DomUtils.getElementsByTagName('nobr',tddom).forEach(nobr => {
                            if(tdIndex == 0){
                                const session = htmlparser2.DomUtils.getInnerHTML(nobr);
                                if(!catchSession.includes(session.substr(0,4))){
                                    breakFlag = true;
                                    return false;
                                }
                                tempFields = initFieldtoArr(perFormanceFields);
                                tempFields[tdIndex] = session;
                                // console.log(htmlparser2.DomUtils.getInnerHTML(nobr));                            
                            } else {
                                htmlparser2.DomUtils.getElementsByTagName('a',nobr).forEach(a => {
                                    tempFields[tdIndex] = htmlparser2.DomUtils.getInnerHTML(a);
                                    // console.log(htmlparser2.DomUtils.getInnerHTML(a));
                                });
                            }
                        })                           
                        if(breakFlag){
                            return false;
                        }             
                        tdIndex++;
                        // console.log('tdIndex',tdIndex);                        
                    });   
                    if(tempFields){
                        sessionPerformances.push(tempFields);
                    }
                    // console.log(tempFields);
                    // process.exit();
                }                                                        
            });
        }            
    });
    console.log(sessionPerformances);    
}

const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => {
        // console.log(dirent);
        return dirent.isDirectory()
    })
    .map(dirent => dirent.name)

const parseAllGoodInfoStockHtml = (path,namefile) => {
    // const path = '/opt/lampp/node/nodeProject/stock/data/mopsPerformanceNoCompany';
    // const path = '/opt/lampp/node/nodeProject/stock/data/mopsPerformance';
    // const name = '8906';    //For Test
    let notUse = 0;
    getDirectories(path).forEach(name => {        
        // const files = ['107_01.html','107_02.html']   
        console.log('=====',name,'=====');    
        const file = `${path}/${name}/${namefile}${name}.html`;        
        if(fs.existsSync(file)){
            const html = fs.readFileSync(file).toString();
            parseGoodInfoPerformanceHtml(html);
        }     
    });
    console.log(notUse);
}

// html = fs.readFileSync('/opt/lampp/node/nodeProject/stock/data/stockPerformance/1101/performance_1101.html').toString();
// parseGoodInfoPerformanceHtml(html);

parseAllGoodInfoStockHtml('/opt/lampp/node/nodeProject/stock/data/stockPerformance','performance_');
