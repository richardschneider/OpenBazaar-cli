'use strict';

const app = require('../lib/app');
const output = require('../lib/output');
const config = require('../lib/server-config');

app.commander
    .option('--json', 'output result as JSON (default if object/array)')
    .option('--text', 'output result as plain text (default if not object/array)')
    .option('--csv', 'output result as CSV')
    .option('--xml', 'output result as XML')
    .option('-v, --verbose', 'verbose');

app.commander
    .command('path')
    .description('display the path to the configuration file')
    .action(() => output.result(config.path))
    ;

app.commander
    .command('list')
    .description('list the open bazaar configuration')
    .alias('ls')
    .action(() => output.result(config.settings))
    ;

app.commander.parse(process.argv);
