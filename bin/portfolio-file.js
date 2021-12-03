const program = require('commander');
const file = require('../commands/file');

program
  .command('set')
  .description('Set file path')
  .action(file.set);

program
  .command('show')
  .description('Show file path')
  .action(file.show);

program.parse(process.argv);

// If no args, output help
if (!process.argv[2]) {
  program.outputHelp();
}