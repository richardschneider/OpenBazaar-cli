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
        .field(key, value)
        .set('Cookie', sessionCookie)
        .catch(err => log.error(err));
};
