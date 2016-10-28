'use strict';

const app = require('../lib/app');
const log = require('../lib/log');
const output = require('../lib/output');
const api = require('../lib/ob-api');

app.commander
    .command('list')
    .description('list the settings')
    .alias('ls')
    .action(() => api
        .getJSON('settings')
        .then(o => output.result(o))
        .catch(e => log.error(e)))
    ;

app.commander
    .command('get <key>')
    .description('get a profile value')
    .action((key) => api
        .getJSON('settings')
        .then(o => output.result(o[key]))
        .catch(e => log.error(e)))
    ;

app.commander
    .command('set <key> <value>')
    .description('set a profile value')
    .action((key, value) => api
        .getJSON('settings')
        .then(settings => {
            settings[key] = value;
            api.postField('settings', settings);
        })
        .catch(e => log.error(e)))
    ;

app.commander.parse(process.argv);
