'use strict';

const app = require('../lib/app');
const output = require('../lib/output');
const api = require('../lib/ob-api');

app.commander
    .command('list [store]')
    .description('list the products')
    .alias('ls')
    .action(store => api
        .getJSON('get_listings', { guid: store })
        .then(o => output.result(o.listings)))
    ;

app.commander.parse(process.argv);
