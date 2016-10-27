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
        .then(o => output.result(o)))
    ;

app.commander.parse(process.argv);
