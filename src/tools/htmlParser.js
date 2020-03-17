const htmlparser2 =require("htmlparser2");
const fs = require('fs');

const parseGetIPHtml = (rawHtml) =>{
    const dom = new htmlparser2.parseDOM(rawHtml);
    const finddoms =  htmlparser2.DomUtils.getElementsByTagName('div',dom);
        finddoms.forEach(finddom => {
            const className = htmlparser2.DomUtils.getAttributeValue(finddom,'class');                
            if(className == 'start_MyIP'){
                console.log("Find Dom:",className);
                const innerHtml = htmlparser2.DomUtils.getInnerHTML(finddom);
                console.log(innerHtml);
                // const innerHandler = new htmlparser2.DomHandler((err, dom) => {
                // }, { verbose: false });
                // const innerParser = new htmlparser2.Parser(innerHandler);
                // innerParser.parseComplete(innerHtml);
                // console.log(htmlparser2.DomUtils.getElementsByTagName('img',innerHandler.dom));
                // console.log("Inner Class:",htmlparser2.DomUtils.getAttributeValue(innerHandler.dom,'src'));
            }
            // console.log("------------------------")
        });
}

const parseMopsPerformanceHtml = (rawHtml) =>{    
    // console.log(rawHtml);
    let parse = true;
    let value = {};
    const dom = new htmlparser2.parseDOM(rawHtml);
    const finddoms =  htmlparser2.DomUtils.getElementsByTagName('table',dom);
    finddoms.forEach(finddom => {
        const className = htmlparser2.DomUtils.getAttributeValue(finddom,'class');      
        // console.log('ClassName：',className);          
        if(className == 'hasBorder'){
            // console.log("Find Dom:",className);
            htmlparser2.DomUtils.getElementsByTagName('tr',finddom).forEach(trdom => {
                // if(htmlparser2.DomUtils.getInnerHTML(finddom).includes('綜合損益表')){                        
                //     parse = true;
                // }
                // else{
                //     return;
                // }
                if(parse){
                    // console.log(findValueWithKeyWord('營業收入合計',trdom));
                    const income = findValueWithKeyWord('營業收入合計',trdom);
                    if(income !== undefined){
                        value.income = income;
                        return;
                    }
                    const perIncome = findValueWithKeyWord('營業毛利（毛損）',trdom);
                    if(perIncome !== undefined){                        
                        value.perIncome = perIncome;
                        return;
                    }
                    const opIncome = findValueWithKeyWord('營業利益',trdom);
                    if(opIncome !== undefined){                        
                        value.opIncome = opIncome;
                        return;
                    }                    
                    
                    const extIncome = findValueWithKeyWord('營業外收入及支出合計',trdom);
                    if(extIncome !== undefined){              
                        value.extIncome = extIncome;
                        return;
                    }
                    const eps = findValueWithKeyWord('基本每股盈餘',trdom);                    
                    if(eps !== NaN && eps !== undefined){
                        // console.log(eps);
                        value.EPS = eps;
                        // return;
                    }
                }
            });                
        }            
    });
    return value;
}

const findValueWithKeyWord = (key,trdom) =>{
    let value = undefined;
    let index = 0;
    if(htmlparser2.DomUtils.getInnerHTML(trdom).includes(key)){                           
        index = 0;
        htmlparser2.DomUtils.getElementsByTagName('td',trdom).forEach(tddom => {            
            if(index === 1){
                // console.log('index:',parseFloat(htmlparser2.DomUtils.getText(tddom).trim().replace(',','')));
                value = parseFloat(htmlparser2.DomUtils.getText(tddom).trim().replace(',',''));
                // console.log('value:',value,key);
                // value = value/100000;                                
            }
            index++;
        })                           
    }
    // if(value)
    //     console.log(value);        
    return value;
}

const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => {
        // console.log(dirent);
        return dirent.isDirectory()
    })
    .map(dirent => dirent.name)

const path = '/opt/lampp/node/nodeProject/stock/data/mopsPerformanceNoCompany';
// const name = '8906';    //For Test
let notUse = 0;
getDirectories(path).forEach(name => {        
    // const files = ['107_01.html','107_02.html']
    const files = ['107_01.html'];
    files.forEach(f=>{
        const file = `${path}/${name}/${f}`;        
        if(fs.existsSync(file)){
            const html = fs.readFileSync(file).toString();
            if(html.includes('公開發行公司不繼續公開發行')){
                console.log(`==============${name} is not available======================`);
                notUse++;
                return;
            }
            if(html.includes('因為安全性考量，您所執行的頁面無法呈現，請關閉瀏覽器後重新嘗試')){
                console.log(`==============${name} Not Catch======================`);
                fs.unlinkSync(file);
                return;
            }
            const value = parseMopsPerformanceHtml(html);    
            if(!value.income && !value.opIncome && !value.extIncome && !value.EPS && !value.perIncome){
                console.log(`==============${name}======================`);
                notUse++;        
                // console.log(notUse);
                // fs.unlinkSync(file);
            }else{
                if(value.income !== undefined && value.opIncome !== undefined && value.extIncome !== undefined && value.EPS !== undefined && value.perIncome !== undefined){

                }else{
                    console.log(`==============${name}======================`);
                    notUse++;        
                    // console.log(name,value);
                }
                // console.log(name,value);
            }
        }
        // else{
        //     console.log(`==============Not Found:${name}======================`);
        // }
    })
    // console.log(`===========================================`)
});
console.log(notUse);
// export default{parseGetIPHtml};
