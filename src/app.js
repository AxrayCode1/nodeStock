import stock from './stock.js';
import yargs from 'yargs';

yargs.version('1.1.0')

yargs.command({
    command: 'catch',
    describe: 'Catch Stock Html',
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
        stock.catchStock({type:argv.t,isCompany:argv.company});
    }
})

yargs.parse();
