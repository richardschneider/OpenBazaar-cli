'use strict';

const app = require('./app');
const ini = require('ini');
const fs = require('fs');
const log = require('./log');

class ServerConfig {
    constructor(options) {
        this.options = options || {};
    }

    get path() {
        return 'C:/Users/Owner/AppData/Local/OpenBazaar/app-1.1.8/resources/OpenBazaar-Server/ob.cfg';
    }

    get settings() {
        return ini.parse(fs.readFileSync(this.path, 'utf-8'));
    }

    get credentials() {
        let credentials = {};

        try {
            let config = this.settings;
            credentials.username = config.AUTHENTICATION.USERNAME;
            credentials.password = config.AUTHENTICATION.PASSWORD;

            log.debug(`Using credentials from ${this.path}`);
        } catch (e) {
            log.warn(e);
        }
        return credentials;
    }
}


module.exports = new ServerConfig(app.options);
