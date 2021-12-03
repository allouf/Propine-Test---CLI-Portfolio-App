const program = require('commander');
const get = require('../commands/get');

program
  .command('value')
  .description('get portfolio value')
  .option(
    '--token <type>',
    'token types: BTC, ETH, XRP, ...',
    'BTC'
    )
  .option(
    '--date <format>',
    'date format: YYYY-MM-DD',
    '2021-12-01'
    )
    /*
  .option(
    '--file <file>', 
    'CSV transactions file', 
    '../data/transactions.csv'
    )*/
    .action(cmd => get.value(cmd));

program.parse(process.argv);

// If no args, output help
if (!process.argv[2]) {
  program.outputHelp();
}