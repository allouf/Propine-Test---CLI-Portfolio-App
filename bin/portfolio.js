#!/usr/bin/env node
const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .command('key', 'Manage API Key -- https://min-api.cryptocompare.com')
  .command('file', 'Manage transactions file')
  .command('get', 'get portfolio value')
  .parse(process.argv);