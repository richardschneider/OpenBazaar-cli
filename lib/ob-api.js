'use strict';

const request = require('superagent');
const log = require('./log');
const app = require('./app');

app.commander
    .option('--server <url>', 'Open Bazaar server url, defaults to "http://localhost:18469"')
    .option('-u, --user <username>[:<password>]')
;

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

// Apply any fixups to the resource before posting.
function postFixups(resourceName, resource) {

    // fix: https://github.com/OpenBazaar/OpenBazaar-Server/issues/495
    if (resourceName === 'settings' && resource.blocked === undefined) {
        resource.blocked = resource.blocked_guids;
    }
}

function login() {
    let credentials = {}; //{ username: 'username', password: 'password'};
    if (app.options.user) {
        let parts = app.options.user.split(':');
        credentials.username = parts[0];
        credentials.password = parts[1];
    }
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

/*
 * postField(string, string, *)
 * postField(string, object)
 */
module.exports.postField = function postField(resourceName, name, value) {
    if (!sessionCookie) {
        return login()
            .then(() =>  postField.apply(this, arguments));
    }

    // Allow an array of fields
    var fields;
    if (typeof name === 'object') {
        fields = name;
    } else {
        fields = {};
        fields[name] = value;
    }

    // Fixup any OB API inconsistencies.
    postFixups(resourceName, fields);

    // Build the multipart POST request.
    let path = url() + resourceName;
    log.debug(`POST ${path}`);
    let req =request.post(path);

    // Add the fields.
    for (let key in fields) {
        let v = fields[key];
        if (v === null || v === undefined) {
            req.field(key, '');
        } else if (Array.isArray(v)) {
            req.field(key, ''); // TODO
        } else {
            req.field(key, v.toString());
        }
    }

    // Go for it.
    return req
        .accept('application/json')
        .set('Cookie', sessionCookie)
        .then(checkResponse)
        .catch(err => log.error(err));
};

module.exports.postJSON = function postJSON(resource, o) {
    if (!sessionCookie) {
        return login()
            .then(() =>  postJSON.apply(this, arguments));
    }

    let path = url() + resource;
    log.debug(`POST ${path}`);
    return request
        .post(path)
        .accept('application/json')
        .send(o)
        .set('Cookie', sessionCookie)
        .then(checkResponse)
        .catch(err => log.error(err));
};
