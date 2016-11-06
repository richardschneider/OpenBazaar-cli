'use strict';

const app = require('./app');

app.commander
    .option('-v, --verbose', 'show debugging infomation');

class Log {
    constructor(options) {
        this.options = options || {};
    }

    warn(s) {
        if (s instanceof Error) {
            if (this.options.verbose && s.stack) {
                console.log(s.stack);
            }
            s = s.message;
        }
        console.log('Warning', s);
    }

    error(s) {
        if (s instanceof Error) {
            if (this.options.verbose && s.stack) {
                console.log(s.stack);
            }
            s = s.message;
        }
        console.log('Error', s);
        process.exit(1);
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
