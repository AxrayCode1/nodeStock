import stock from './stock.js';
import yargs from 'yargs';

yargs.version('1.1.0')

yargs.command({
    command: 'catch_goodinfo',
    describe: 'Catch GoodInfo Stock Html',
    builder: {   
        type: {
            alias: 't',
            choices:['salemonth','performance','dividend'],
            describe: 'Catch Type',
            demandOption: true,
            type: 'string'
        },
        company: {
            alias: 'c',
            choices:[0,1],
            describe: 'Is Company',
            demandOption: true,
            type: 'number'
        }     
        // url: {
        //     alias: 'u',
        //     demandOption:true,
        //     default: 'http://yargs.js.org/'
        // }
    },
    handler: function (argv) {
        // console.log(argv);
        stock.catchGoodInfoStock({isMops:false,...argv});
    }
})

yargs.command({
    command: 'catch_mops',
    describe: 'Catch Mops Stock Html',
    builder: {   
        type: {
            alias: 't',
            choices:['salemonth','performance','dividend'],
            describe: 'Catch Type',
            demandOption: true,
            type: 'string'
        },
        company: {
            alias: 'c',
            choices:[0,1],
            describe: 'Is Company',
            demandOption: true,
            type: 'number'
        },               
        year: {
            alias: 'y',            
            describe: 'Year(Like 2020,2019 ...)',
            demandOption: true,
            type: 'number'
        },
        season: {
            alias: 's',            
            describe: 'Session',
            choices:['01','02','03','04'],
            type: 'string'
        }       
    },
    handler: function (argv) {
        // console.log(argv);        
        stock.catchMopsStock({isMops:true,...argv});
        // stock.catchStock({type:argv.t,isCompany:argv.company});
    }
})

yargs.parse();
