'use strict';

const app = require('./app');
const ini = require('ini');
const fs = require('fs');
const os = require('os');
const process = require('process');
const log = require('./log');

app.commander
    .option('--sconfig <path>', 'the path to the server\'s ob.cfg file')
;

class ServerConfig {
    constructor(options) {
        this.options = options || {};
    }

    get path() {
        this._path = this.options.sconfig;
        if (!this._path) {
            let platform = os.platform();
            if (platform === 'win32') {
                this._path = process.env.LOCALAPPDATA + '/OpenBazaar/app-1.1.8/resources/OpenBazaar-Server/ob.cfg';
            } else if (platform === 'darwin') {
                this._path = '/Applications/OpenBazaar/Content/Resources/OpenBazaar-Server/ob.cfg';
            } else { // *nix
                this._path = '/usr/share/openbazaar/resources/OpenBazaar-Server/ob.cfg';
            }
        }
        return this._path;
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
