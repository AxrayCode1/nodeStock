"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var htmlparser2 = require("htmlparser2");

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

var _default = {
  parseGetIPHtml: parseGetIPHtml
}; // const parseHtml = (htmlBody) => {    
//     const rawHtml = htmlBody;
//     // console.log(rawHtml);
//     // const rawHtml = `<!DOCTYPE html>
//     // <html lang="en">
//     //     <head>            
//     //     </head>
//     //     <body>
//     //         <header class="header">
//     //             <div class="header__logo-box">
//     //                 <img src="img/logo-white.png" alt="Logo" class="header__logo">                
//     //             </div>
//     //             <div class="header__text-box">
//     //                 <h1 class="heading-primary">
//     //                     <span class="heading-primary--main">Outdoors</span>
//     //                     <span class="heading-primary--sub">is where life happens</span>
//     //                 </h1>
//     //                 <a href="#" class="btn btn--white btn--animated">Discover out tours</a>
//     //             </div>            
//     //         </header>
//     //     </body>
//     // </html>`;
//     // const handler = new htmlparser2.DomHandler( (error, dom) => {
//     //         // console.log('Dom:',dom);
//     //         const finddoms =  htmlparser2.DomUtils.getElementsByTagName('div',dom);
//     //         finddoms.forEach(finddom => {
//     //             const className = htmlparser2.DomUtils.getAttributeValue(finddom,'class');                
//     //             if(className == 'header__logo-box'){
//     //                 console.log("Find Dom:",className);
//     //                 const innerHtml = htmlparser2.DomUtils.getInnerHTML(finddom);
//     //                 console.log(innerHtml);
//     //                 const innerHandler = new htmlparser2.DomHandler((err, dom) => {
//     //                 }, { verbose: false });
//     //                 const innerParser = new htmlparser2.Parser(innerHandler);
//     //                 innerParser.parseComplete(innerHtml);
//     //                 console.log(htmlparser2.DomUtils.getElementsByTagName('img',innerHandler.dom));
//     //                 console.log("Inner Class:",htmlparser2.DomUtils.getAttributeValue(innerHandler.dom,'src'));
//     //             }
//     //             console.log("------------------------")
//     //         });
//     // });
//     // const parser = new htmlparser2.Parser(handler);
//     // parser.write(rawHtml);
//     // parser.done();
//     //Sample Code
//     // const dom = new htmlparser2.parseDOM(rawHtml);
//     // const finddoms =  htmlparser2.DomUtils.getElementsByTagName('div',dom);
//     //         finddoms.forEach(finddom => {
//     //             const className = htmlparser2.DomUtils.getAttributeValue(finddom,'class');                
//     //             if(className == 'header__logo-box'){
//     //                 console.log("Find Dom:",className);
//     //                 const innerHtml = htmlparser2.DomUtils.getInnerHTML(finddom);
//     //                 console.log(innerHtml);
//     //                 const innerHandler = new htmlparser2.DomHandler((err, dom) => {
//     //                 }, { verbose: false });
//     //                 const innerParser = new htmlparser2.Parser(innerHandler);
//     //                 innerParser.parseComplete(innerHtml);
//     //                 console.log(htmlparser2.DomUtils.getElementsByTagName('img',innerHandler.dom));
//     //                 console.log("Inner Class:",htmlparser2.DomUtils.getAttributeValue(innerHandler.dom,'src'));
//     //             }
//     //             console.log("------------------------")
//     //         });
//     const dom = new htmlparser2.parseDOM(rawHtml);
//     const finddoms =  htmlparser2.DomUtils.getElementsByTagName('div',dom);
//             finddoms.forEach(finddom => {
//                 const className = htmlparser2.DomUtils.getAttributeValue(finddom,'class');                
//                 if(className == 'start_MyIP'){
//                     console.log("Find Dom:",className);
//                     const innerHtml = htmlparser2.DomUtils.getInnerHTML(finddom);
//                     console.log(innerHtml);
//                     // const innerHandler = new htmlparser2.DomHandler((err, dom) => {
//                     // }, { verbose: false });
//                     // const innerParser = new htmlparser2.Parser(innerHandler);
//                     // innerParser.parseComplete(innerHtml);
//                     // console.log(htmlparser2.DomUtils.getElementsByTagName('img',innerHandler.dom));
//                     // console.log("Inner Class:",htmlparser2.DomUtils.getAttributeValue(innerHandler.dom,'src'));
//                 }
//                 // console.log("------------------------")
//             });
//     // var htmlparser =require("htmlparser2");
//     // var rawHtml ="Xyz <script language= javascript>var foo = '<<bar>>';</script><!--<!-- Waah! -- -->";
//     // var handler =new htmlparser.DomHandler(function (error, dom) {
//     //     if (error)
//     //     {
//     //         // console.log(error);
//     //     }
//     //     else{            
//     //         console.log(dom);
//     //     }
//     // });
//     // var parser =new htmlparser.Parser(handler);
//     // parser.write(rawHtml);
//     // parser.end();    
//     // const parser = new htmlparser2.Parser(
//     //     {
//     //         onopentag(name, attribs) {
//     //             console.log('Open Tag:',name);
//     //             console.log('Class:', attribs.class);
//     //             if (name === "div" && attribs.class === "header__logo-box") {
//     //                 // console.log("JS! Hooray!");
//     //                 const innerHTML = htmlparser2.DomUtils.getInnerHTML(node);
//     //                 console.log(innerHTML);
//     //             }
//     //         },
//     //         ontext(text) {
//     //             console.log("-->", text);
//     //         },
//     //         onclosetag(tagname) {
//     //             if (tagname === "div") {
//     //                 console.log("That's it?!");
//     //             }
//     //         }
//     //     },
//     //     { decodeEntities: true }
//     // );
//     // parser.write(
//     //     rawHtml
//     // );
//     // parser.end();
// }

exports["default"] = _default;