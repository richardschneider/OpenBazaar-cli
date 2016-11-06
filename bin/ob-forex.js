'use strict';

const app = require('../lib/app');
const output = require('../lib/output');
const api = require('../lib/ob-api');

app.commander
    .command('list [currency]')
    .description('list the forex prices')
    .alias('ls')
    .action(currency => api
        .getJSON('btc_price', {currency: currency})
        .then(o => output.result(o)))
    ;

app.commander.parse(process.argv);
