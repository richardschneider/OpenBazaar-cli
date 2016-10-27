'use strict';

const app = require('./app');

app.commander
    .option('-v, --verbose', 'show debugging infomation');

class Log {
    constructor(options) {
        this.options = options || {};
    }


    error(s) {
        console.log('Error', s);
    }

    info(s) {
        console.log(s);
    }

    debug(s) {
        if (this.options.verbose) {
            console.log(s);
        }
    }
}

module.exports = new Log(app.options);
