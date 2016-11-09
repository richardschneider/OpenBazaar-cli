'use strict';

const request = require('superagent');
const app = require('../lib/app');
const log = require('../lib/log');
const output = require('../lib/output');
const api = require('../lib/ob-api');

let geoipBlackList = { ip: true, longitude: true, latitude: true};

function ipinfo(ipaddr) {
    return request
        .get(`freegeoip.net/json/${ipaddr}`)
        .accept('json')
        .then(res => {
            let geoip = res.body;
            let geo = { // GeoJSON, RFC 7946
                type: 'Feature',
                id: ipaddr,
                geometry: {
                    type: 'Point',
                    coordinates: [ geoip.longitude, geoip.latitude]
                },
                properties: {}
            };
            Object.getOwnPropertyNames(geoip)
                .filter(p => !geoipBlackList[p])
                .forEach(p => geo.properties[p] = geoip[p])
            ;
            return geo;
        })
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
                .then(features => {
                    return {
                        type: 'FeatureCollection',
                        features: features
                    };
                })
                .then(result => output.result(result))
                .catch(e => log.error(e))
            ;
        } else {
            output.result(peers);
        }
    })
;
