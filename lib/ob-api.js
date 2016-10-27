'use strict';

const request = require('superagent');
const log = require('./log');

var sessionCookie;

function url() {
    return 'http://localhost:18469/api/v1/';
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

function get() {
    if (!sessionCookie) {
        return login()
            .then(() =>  get.apply(this, arguments));
    }

    let path = Array.from(arguments)
        .filter(e => e) // remove nulls, undefines, etc.
        .join('/');
    log.debug(`GET ${url() + path}`);
    return request
        .get(url() + path)
        .accept('application/json')
        .set('Cookie', sessionCookie)
        .catch(err => console.log(err));
}


module.exports.getJSON = function getJSON() {
    return get.apply(this, arguments)
        .then(req => req.body);
};
