'use strict';

const app = require('./app');
const ini = require('ini');
const fs = require('fs');

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
}


module.exports = new ServerConfig(app.options);
