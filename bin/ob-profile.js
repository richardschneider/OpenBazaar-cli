'use strict';

const app = require('../lib/app');
const output = require('../lib/output');
const api = require('../lib/ob-api');

app.commander
    .command('list [target]')
    .description('list the profile')
    .alias('ls')
    .action(target => api
        .getJSON('profile', { guid: target })
        .then(o => output.result(o.profile)))
    ;

app.commander
    .command('get <key> [target]')
    .description('get a profile value')
    .action((key, target) => api
        .getJSON('profile', { guid: target })
        .then(o => output.result(o.profile[key])))
    ;

app.commander
    .command('set <key> <value>')
    .description('set a profile value')
    .action((key, value) => api.postField('profile', key, value))
    ;

app.commander.parse(process.argv);
