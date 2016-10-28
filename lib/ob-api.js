'use strict';

const request = require('superagent');
const log = require('./log');
const app = require('./app');

app.commander
    .option('--server <url>', 'Open Bazaar server url, defaults to "http://localhost:18469"');

var sessionCookie;

function url() {
    return (app.options.server || 'http://localhost:18469') + '/api/v1/';
}

// Apply any fixups to the server respone
// Raise an error if success === false
function checkResponse (res) {
    // fix: https://github.com/OpenBazaar/OpenBazaar-Server/issues/494
    if (res.get('content-type') === 'text/html' && res.text.length > 0 && res.text[0] === '{') {
        res.body = JSON.parse(res.text);
    }

    // Many responses return 200 OK with { "success: false, reason: '...' }
    if (res.body && res.body.success === false){
        log.error(res.body.reason || 'Open Bazaar server failed with no reason');
    }
    return res;
}

function login() {
    let credentials = { username: 'username', password: 'password'};
    log.debug(`logging into ${url()}`);
    return request
        .post(url() + 'login')
        .type('form')
        .send(credentials)
        .then(res => {
            if (!res.body.success) {
                log.error(('Open Bazaar login failed: ' + res.body.reason));
            }
            sessionCookie = res.headers['set-cookie'].pop().split(';')[0];
        })
        .catch(err => log.error('Open Bazaar login failed: ' + err.message));
}

function get(resource, query) {
    if (!sessionCookie) {
        return login()
            .then(() =>  get.apply(this, arguments));
    }

    let path = url() + resource;
    log.debug(`GET ${path}`);
    return request
        .get(path)
        .accept('application/json')
        .query(query || {})
        .set('Cookie', sessionCookie)
        .then(checkResponse)
        .catch(err => log.error(err));
}


module.exports.getJSON = function getJSON() {
    return get.apply(this, arguments)
        .then(req => req.body);
};

module.exports.postField = function postField(resource, key, value) {
    if (!sessionCookie) {
        return login()
            .then(() =>  postField.apply(this, arguments));
    }

    let path = url() + resource;
    log.debug(`POST ${path}`);
    return request
        .post(path)
        .accept('application/json')
        .field(key, value)
        .set('Cookie', sessionCookie)
        .then(checkResponse)
        .catch(err => log.error(err));
};
