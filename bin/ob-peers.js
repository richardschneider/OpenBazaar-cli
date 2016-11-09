'use strict';

const app = require('../lib/app');
const output = require('../lib/output');
const api = require('../lib/ob-api');

app.commander.parse(process.argv);

api
    .getJSON('connected_peers')
    .then(o => {
        let peers = o.peers.map(p => p[0]);
        output.result(peers);
    })
;
