"use strict";

var htmlparser2 = require("htmlparser2");

var fs = require('fs');

var parseGetIPHtml = function parseGetIPHtml(rawHtml) {
  var dom = new htmlparser2.parseDOM(rawHtml);
  var finddoms = htmlparser2.DomUtils.getElementsByTagName('div', dom);
  finddoms.forEach(function (finddom) {
    var className = htmlparser2.DomUtils.getAttributeValue(finddom, 'class');

    if (className == 'start_MyIP') {
      console.log("Find Dom:", className);
      var innerHtml = htmlparser2.DomUtils.getInnerHTML(finddom);
      console.log(innerHtml); // const innerHandler = new htmlparser2.DomHandler((err, dom) => {
      // }, { verbose: false });
      // const innerParser = new htmlparser2.Parser(innerHandler);
      // innerParser.parseComplete(innerHtml);
      // console.log(htmlparser2.DomUtils.getElementsByTagName('img',innerHandler.dom));
      // console.log("Inner Class:",htmlparser2.DomUtils.getAttributeValue(innerHandler.dom,'src'));
    } // console.log("------------------------")

  });
};

var parseMopsPerformanceHtml = function parseMopsPerformanceHtml(rawHtml) {
  // console.log(rawHtml);
  var parse = true;
  var value = {};
  var dom = new htmlparser2.parseDOM(rawHtml);
  var finddoms = htmlparser2.DomUtils.getElementsByTagName('table', dom);
  finddoms.forEach(function (finddom) {
    var className = htmlparser2.DomUtils.getAttributeValue(finddom, 'class'); // console.log('ClassName：',className);          

    if (className == 'hasBorder') {
      // console.log("Find Dom:",className);
      htmlparser2.DomUtils.getElementsByTagName('tr', finddom).forEach(function (trdom) {
        // if(htmlparser2.DomUtils.getInnerHTML(finddom).includes('綜合損益表')){                        
        //     parse = true;
        // }
        // else{
        //     return;
        // }
        if (parse) {
          // console.log(findValueWithKeyWord('營業收入合計',trdom));
          var income = findValueWithKeyWord('營業收入合計', trdom);

          if (income) {
            value.income = income;
            return;
          }

          var opIncome = findValueWithKeyWord('營業利益', trdom);

          if (opIncome) {
            value.opIncome = opIncome;
            return;
          }

          var extIncome = findValueWithKeyWord('營業外收入及支出合計', trdom);

          if (extIncome) {
            value.extIncome = extIncome;
            return;
          }

          var eps = findValueWithKeyWord('基本每股盈餘合計', trdom);

          if (eps) {
            value.EPS = eps;
            return;
          }
        }
      });
    }
  });
  return value;
};

var findValueWithKeyWord = function findValueWithKeyWord(key, trdom) {
  var value = undefined;
  var index = 0;

  if (htmlparser2.DomUtils.getInnerHTML(trdom).includes(key)) {
    index = 0;
    htmlparser2.DomUtils.getElementsByTagName('td', trdom).forEach(function (tddom) {
      if (index === 1) {
        // console.log('index:',parseFloat(htmlparser2.DomUtils.getText(tddom).trim().replace(',','')));
        value = parseFloat(htmlparser2.DomUtils.getText(tddom).trim().replace(',', '')); // console.log(value);
        // value = value/100000;                                
      }

      index++;
    });
  } // if(value)
  //     console.log(value);        


  return value;
};

var getDirectories = function getDirectories(source) {
  return fs.readdirSync(source, {
    withFileTypes: true
  }).filter(function (dirent) {
    // console.log(dirent);
    return dirent.isDirectory();
  }).map(function (dirent) {
    return dirent.name;
  });
};

var path = '/opt/lampp/node/nodeProject/stock/data/mopsPerformanceNoCompany';
var notFound = 0;
getDirectories(path).forEach(function (name) {
  // console.log(`==============${name}======================`)
  var file = "".concat(path, "/").concat(name, "/107_01.html");

  if (fs.existsSync(file)) {
    var html = fs.readFileSync(file).toString();

    if (html.includes('公開發行公司不繼續公開發行')) {
      console.log("==============".concat(name, " is not available======================"));
      return;
    }

    if (html.includes('因為安全性考量，您所執行的頁面無法呈現，請關閉瀏覽器後重新嘗試')) {
      console.log("==============".concat(name, " Not Catch======================"));
      fs.unlinkSync(file);
      return;
    }

    var value = parseMopsPerformanceHtml(html);

    if (!value.income && !value.opIncome && !value.extIncome && !value.EPS) {
      console.log("==============".concat(name, "======================"));
      notFound++;
      console.log(notFound); // fs.unlinkSync(file);
    }
  } else {
    console.log("==============Not Found:".concat(name, "======================"));
  } // console.log(`===========================================`)

}); // export default{parseGetIPHtml};