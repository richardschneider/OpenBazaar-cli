'use strict';

const request = require('superagent');
const app = require('../lib/app');
const log = require('../lib/log');
const output = require('../lib/output');
const api = require('../lib/ob-api');

function ipinfo(ipaddr) {
    return request
        .get(`freegeoip.net/json/${ipaddr}`)
        .then(res => res.body)
    ;
}

app.commander
    .option('--geo', 'add geographical info about the ip address')
    .parse(process.argv)
;

api
    .getJSON('connected_peers')
    .then(o => {
        let peers = o.peers.map(p => p[0]);
        if (app.options.geo) {
            return Promise
                .all(peers.map(ipinfo))
                .then(result => output.result(result))
                .catch(e => log.error(e))
            ;
        } else {
            output.result(peers);
        }
    })
;
