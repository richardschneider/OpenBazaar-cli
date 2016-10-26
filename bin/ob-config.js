'use strict';

const app = require('../lib/app');
const output = require('../lib/output');

app.commander
    .option('--json', 'output result as JSON (default)')
    .option('--csv', 'output result as CSV')
    .option('--xml', 'output result as XML')
    .option('-v, --verbose', 'verbose');

app.commander
    .command('path')
    .description('display the path to the configuration file')
    .action(() => output.error('path nyi'))
    ;

app.commander
    .command('list')
    .description('list the open bazaar configuration')
    .alias('ls')
    .action(() => output.result('foobar'))
    ;

app.commander.parse(process.argv);
